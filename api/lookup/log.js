// POST { key, tool, query } -> records a lookup and decrements remaining
import { getUsers, saveUsers } from '../_lib/storage.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed' });
  const { key, tool, query } = req.body;
  if (!key || !tool) return res.status(400).json({ error:'Missing params' });
  const users = await getUsers();
  const u = users[key];
  if (!u) return res.status(404).json({ error:'Key not found' });
  if ((u.remaining ?? 0) <= 0) return res.status(403).json({ error:'No remaining lookups' });
  // record
  u.total = (u.total || 0) + 1;
  u.remaining = (u.remaining ?? 0) - 1;
  u.history = u.history || [];
  u.history.push({ ts: Date.now(), tool, query: query || '' });
  // cap history
  if (u.history.length > 1000) u.history.shift();
  await saveUsers(users);
  return res.status(200).json({ ok:true, total:u.total, remaining:u.remaining });
}
