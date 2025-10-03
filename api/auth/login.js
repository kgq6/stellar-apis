// GET ?key=XXXX-XXXX-XXXX-XXXX
import { getUsers } from './_lib/storage.js';
export default async function handler(req, res) {
  const { key } = req.query;
  if (!key) return res.status(400).json({ error:'Missing key' });
  const users = await getUsers();
  const u = users[key];
  if (!u) return res.status(404).json({ error:'Key not found' });
  // return safe user info
  return res.status(200).json({ valid:true, key: u.key, remaining: u.remaining, total: u.total });
}
