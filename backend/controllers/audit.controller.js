import AuditLog from "../models/AuditLog.js";

export const getLogs = async (req, res) => {
  const logs = await AuditLog.find().sort({ createdAt: -1 });
  res.json(logs);
};

export const createLog = async (req, res) => {
  const log = await AuditLog.create(req.body);
  res.status(201).json(log);
};