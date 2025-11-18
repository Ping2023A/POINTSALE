import Inventory from "../models/Inventory.js";

export const getAll = async (req, res) => {
  const items = await Inventory.find();
  res.json(items);
};

export const create = async (req, res) => {
  const item = await Inventory.create(req.body);
  res.status(201).json(item);
};

export const update = async (req, res) => {
  const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
};

export const remove = async (req, res) => {
  await Inventory.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};