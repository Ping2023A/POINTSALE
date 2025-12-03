import express from "express";
import Store from "../models/Store.js";

const router = express.Router();

// ✅ Create Store
router.post("/", async (req, res) => {
  try {
    // Ensure 'ownerEmail' is provided
    const { ownerEmail, name, owner, phone, address, currency, tax, logo } = req.body;
    if (!ownerEmail || !name || !owner) {
      return res.status(400).json({ error: "Missing required fields: ownerEmail, name, or owner" });
    }

    const store = new Store({ ownerEmail, name, owner, phone, address, currency, tax, logo });
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
    const createdStores = await Store.find({ ownerEmail: email });

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

// ✅ Delete Store (only owner can delete)
router.delete("/:id", async (req, res) => {
  const { email } = req.body; // owner email must be provided in body
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: "Store not found" });

    if (!email || store.ownerEmail !== email) {
      return res.status(403).json({ error: "Only the owner can delete this store" });
    }

    await store.deleteOne();
    res.json({ message: "Store deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
