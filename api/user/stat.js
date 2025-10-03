// GET ?key=...
import { getUsers } from '../_lib/storage.js';
export default async function handler(req, res) {
  const { key } = req.query;
  if (!key) return res.status(400).json({ error:'Missing key' });
  const users = await getUsers();
  const u = users[key];
  if (!u) return res.status(404).json({ error:'Key not found' });
  return res.status(200).json({
    key: u.key,
    total: u.total || 0,
    remaining: u.remaining ?? 0,
    history: u.history || [],
    activeSince: u.activeSince ? new Date(u.activeSince).toISOString() : null
  });
}
