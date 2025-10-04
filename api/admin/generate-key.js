import { getUsers, saveUsers } from '../_lib/storage.js';

function genKey() {
  const rand4 = () => Math.floor(1000 + Math.random() * 9000).toString();
  return `${rand4()}-${rand4()}-${rand4()}-${rand4()}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed' });

  const { adminKey } = req.body;
  const users = await getUsers();
  const admin = users[adminKey];
  if (!admin || !admin.admin) return res.status(403).json({ error:'Unauthorized' });

  const key = genKey();
  users[key] = {
    key,
    total: 0,
    remaining: 1000,
    history: [],
    createdAt: Date.now(),
    expiresAt: Date.now() + 1000*60*60*24*30, // 30 days default
    banned: false,
    owner: null,
    ip: null,
    admin: false
  };

  await saveUsers(users);
  return res.status(200).json({ key });
}
