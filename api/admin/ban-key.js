import { getUsers, saveUsers } from '../_lib/storage.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed' });

  const { adminKey, targetKey } = req.body;
  const users = await getUsers();
  const admin = users[adminKey];
  if (!admin || !admin.admin) return res.status(403).json({ error:'Unauthorized' });

  if (!users[targetKey]) return res.status(404).json({ error:'Key not found' });

  users[targetKey].banned = true;
  await saveUsers(users);

  res.status(200).json({ success: true });
}
