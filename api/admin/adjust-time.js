import { getUsers, saveUsers } from '../_lib/storage.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed' });

  const { adminKey, targetKey, minutes } = req.body;
  const users = await getUsers();
  const admin = users[adminKey];
  if (!admin || !admin.admin) return res.status(403).json({ error:'Unauthorized' });

  const u = users[targetKey];
  if (!u) return res.status(404).json({ error:'Key not found' });

  u.expiresAt = (u.expiresAt || Date.now()) + minutes * 60 * 1000;
  await saveUsers(users);

  res.status(200).json({ success:true, newExpiry: u.expiresAt });
}
