import Inventory from "../models/Inventory.js";
import AuditLog from "../models/AuditLog.js";

const getUserFromReq = (req) => {
  // try common places for user info; fallback to system
  const email = req.user?.email || req.body?.userEmail || 'system@local';
  const role = req.user?.role || req.body?.userRole || 'System';
  return { email, role };
};

export const getAll = async (req, res) => {
  const items = await Inventory.find();
  res.json(items);
};

export const create = async (req, res) => {
  const item = await Inventory.create(req.body);

  // Audit log
  try {
    const user = getUserFromReq(req);
    const action = `Created item "${item.name}" (category: ${item.category}, stock: ${item.stock}, price: ${item.price})`;
    await AuditLog.create({ email: user.email, role: user.role, action, date: new Date() });
  } catch (e) {
    console.error('Failed to write audit log (create):', e);
  }

  res.status(201).json(item);
};

export const update = async (req, res) => {
  const id = req.params.id;
  const before = await Inventory.findById(id).lean();
  const after = await Inventory.findByIdAndUpdate(id, req.body, { new: true });

  // Build change summary
  try {
    const user = getUserFromReq(req);
    const fields = ['name','category','stock','price'];
    const changes = [];
    if (before) {
      fields.forEach(f => {
        const bv = before[f];
        const av = after[f];
        if (String(bv) !== String(av)) changes.push(`${f}: ${bv} -> ${av}`);
      });
    }
    const action = changes.length > 0
      ? `Edited item "${after?.name || id}" — ${changes.join('; ')}`
      : `Edited item "${after?.name || id}"`;
    await AuditLog.create({ email: user.email, role: user.role, action, date: new Date() });
  } catch (e) {
    console.error('Failed to write audit log (update):', e);
  }

  res.json(after);
};

export const remove = async (req, res) => {
  const id = req.params.id;
  const before = await Inventory.findById(id).lean();
  await Inventory.findByIdAndDelete(id);

  try {
    const user = getUserFromReq(req);
    const action = before ? `Deleted item "${before.name}" (id: ${id})` : `Deleted item id ${id}`;
    await AuditLog.create({ email: user.email, role: user.role, action, date: new Date() });
  } catch (e) {
    console.error('Failed to write audit log (delete):', e);
  }

  res.json({ message: "Deleted" });
};