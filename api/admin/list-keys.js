import { getUsers } from '../_lib/storage.js';

export default async function handler(req, res) {
  const { adminKey } = req.query;
  const users = await getUsers();
  const admin = users[adminKey];
  if (!admin || !admin.admin) return res.status(403).json({ error:'Unauthorized' });

  return res.status(200).json({ keys: Object.values(users) });
}
