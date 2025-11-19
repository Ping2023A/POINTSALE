import Role from "../models/Role.js";

export const getRoles = async (req, res) => {
  const roles = await Role.find();
  res.json(roles);
};

export const createRole = async (req, res) => {
  const role = await Role.create(req.body);
  res.status(201).json(role);
};

export const updateRole = async (req, res) => {
  const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(role);
};

export const deleteRole = async (req, res) => {
  await Role.findByIdAndDelete(req.params.id);
  res.json({ message: "Role deleted" });
};