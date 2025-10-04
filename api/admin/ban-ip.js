import { getUsers, saveUsers } from '../_lib/storage.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed' });

  const { adminKey, ip } = req.body;
  const users = await getUsers();
  const admin = users[adminKey];
  if (!admin || !admin.admin) return res.status(403).json({ error:'Unauthorized' });

  // Mark IP as banned in a special "bannedIPs" object in users
  users._bannedIPs = users._bannedIPs || [];
  if (!users._bannedIPs.includes(ip)) {
    users._bannedIPs.push(ip);
  }
  await saveUsers(users);

  res.status(200).json({ success:true });
}
