// POST { key: keyToActivate, userKey: yourKey }
import { getUsers, saveUsers } from './_lib/storage.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed' });
  const { key, userKey } = req.body;
  if (!key || !userKey) return res.status(400).json({ error:'Missing parameters' });
  const users = await getUsers();
  const target = users[key];
  const user = users[userKey];
  if (!user) return res.status(404).json({ error:'Your session key not found' });
  if (!target) return res.status(404).json({ error:'Activation key not found' });
  // Example activation logic: transfer remaining from target to user and invalidate target
  user.remaining = (user.remaining || 0) + (target.remaining || 0);
  target.remaining = 0;
  await saveUsers(users);
  return res.status(200).json({ message: 'Activated. Remaining updated.', remaining: user.remaining });
}
