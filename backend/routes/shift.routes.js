import express from "express";
import Shift from "../models/Shift.js";
import Role from "../models/Role.js";

const router = express.Router();

// Get all employees (for shift page)
router.get("/employees", async (req, res) => {
  try {
    const employees = await Role.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get shifts for a week (pass weekStart=YYYY-MM-DD)
// Mounted at `/api/shifts` so use root path here
router.get("/", async (req, res) => {
  try {
    const { weekStart } = req.query;
    if (weekStart) {
      const start = new Date(weekStart);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];
      const shifts = await Shift.find({ date: { $gte: startStr, $lte: endStr } });
      return res.json(shifts);
    }

    const shifts = await Shift.find();
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new shift (single)
router.post("/", async (req, res) => {
  try {
    const { employeeId, date, type, start, end, status } = req.body;
    const shift = new Shift({ employeeId, date, type, start, end, status });
    await shift.save();
    res.json(shift);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bulk replace/create shifts
// Accepts an array of shift objects: [{ employeeId, date, type, start, end, status }, ...]
router.post("/bulk", async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ message: 'Expected an array of shifts' });

    // Separate deletion requests from create requests.
    // Deletion items should be objects with `{ employeeId, date, _delete: true }`.
    const deletions = items.filter(i => i && i._delete).map(d => ({ employeeId: d.employeeId, date: d.date }));
    const toCreate = items.filter(i => i && !i._delete);

    // Perform deletions for specified pairs
    if (deletions.length) {
      const delPromises = deletions.map(d => Shift.deleteMany({ employeeId: d.employeeId, date: d.date }));
      await Promise.all(delPromises);
    }

    // If there are non-deletion items, remove any existing shifts for their (employeeId,date)
    if (toCreate.length) {
      const pairs = toCreate.map(i => `${i.employeeId}::${i.date}`);
      const uniquePairs = Array.from(new Set(pairs));
      const removeExisting = uniquePairs.map(p => {
        const [employeeId, date] = p.split('::');
        return Shift.deleteMany({ employeeId, date });
      });
      await Promise.all(removeExisting);

      const created = await Shift.insertMany(toCreate);
      return res.status(201).json(created);
    }

    // If only deletions were requested, respond with success and count
    return res.status(200).json({ deleted: deletions.length });
  } catch (err) {
    console.error('Bulk shifts error', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
