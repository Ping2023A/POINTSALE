// backend/controllers/roles.controller.js
import Role from "../models/Role.js";
import Shift from "../models/Shift.js";

// Get all roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.json(roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch roles" });
  }
};

// Create a new role
export const createRole = async (req, res) => {
  try {
    const { email } = req.body;

    // Prevent duplicate emails
    const existing = await Role.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const role = await Role.create(req.body);//here

    // Create default morning shifts for the new role for the current week (Mon-Fri)
    try {
      const today = new Date();
      const day = today.getDay();
      const diff = day === 0 ? -6 : 1 - day; // compute Monday
      const monday = new Date(today);
      monday.setDate(today.getDate() + diff);

      const shiftsToCreate = [];
      for (let i = 0; i < 5; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        shiftsToCreate.push({
          employeeId: role._id,
          date: dateStr,
          type: 'morning',
          start: '06:00',
          end: '14:00',
          status: 'assigned'
        });
      }
      await Shift.insertMany(shiftsToCreate);
    } catch (shiftErr) {
      console.error('Failed to create default shifts for new role:', shiftErr);
    }

    res.status(201).json(role);//stop
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create role" });
  }
};

// Update role
export const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!role) return res.status(404).json({ message: "Role not found" });

    res.json(role);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update role" });
  }
};

// Delete role
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    res.json({ message: "Role deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete role" });
  }
};
