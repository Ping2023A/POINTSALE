import express from "express";
import Store from "../models/Store.js";

const router = express.Router();

// ✅ Create Store
router.post("/", async (req, res) => {
  try {
    const store = new Store(req.body);
    await store.save();
    res.status(201).json(store);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Join Store
router.post("/join", async (req, res) => {
  const { storeCode, email, role } = req.body;
  try {
    const store = await Store.findById(storeCode); // storeCode = _id
    if (!store) return res.status(404).json({ error: "Store not found" });

    // Check if already a member
    const exists = store.members.find((m) => m.email === email);
    if (exists) return res.status(400).json({ error: "Already joined" });

    store.members.push({ email, role });
    await store.save();

    res.json({ message: "Joined successfully", storeName: store.name });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ My Stores (created or joined)
router.get("/mystores", async (req, res) => {
  const { email } = req.query; // pass user email in query
  try {
    // Stores created by this user (owner email)
    const createdStores = await Store.find({ email: email });

    // Stores joined by this user (member email)
    const joinedStores = await Store.find({ "members.email": email });

    // Merge results (avoid duplicates if user is both owner & member)
    const allStores = [...createdStores, ...joinedStores].filter(
      (store, index, self) =>
        index === self.findIndex((s) => s._id.toString() === store._id.toString())
    );

    res.json(allStores);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Leave Store
router.post("/:id/leave", async (req, res) => {
  const { email } = req.body;
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: "Store not found" });

    store.members = store.members.filter((m) => m.email !== email);
    await store.save();

    res.json({ message: "Left store successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;