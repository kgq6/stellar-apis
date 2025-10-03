// api/auth/login.js
import { getUsers, saveUsers } from '../_lib/storage.js';

export default async function handler(req, res) {
  const { key } = req.query;
  if (!key) return res.status(400).json({ error:'Missing key' });

  const regex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
  if (!regex.test(key)) {
    return res.status(400).json({ error:'Invalid key format' });
  }

  const users = await getUsers();
  let u = users[key];

  if (!u) {
    // auto-register unknown key
    u = { key, total: 0, remaining: 1000, history: [], created: Date.now(), activeSince: Date.now() };
    users[key] = u;
    await saveUsers(users);
  }

  return res.status(200).json({
    valid: true,
    key: u.key,
    remaining: u.remaining,
    total: u.total
  });
}
