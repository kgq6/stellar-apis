// POST -> generates a unique key and stores a user record
import { getUsers, saveUsers } from './_lib/storage.js';

function genKeyOnce() {
  // 16 numeric digits grouped 4-4-4-4
  const rand4 = () => Math.floor(1000 + Math.random() * 9000).toString();
  return `${rand4()}-${rand4()}-${rand4()}-${rand4()}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed' });
  const users = await getUsers();
  // generate until unique (rare loop)
  for (let i=0;i<10;i++){
    const k = genKeyOnce();
    if (!users[k]) {
      users[k] = { key:k, total:0, remaining: 1000, history:[], created: Date.now(), activeSince: Date.now() };
      await saveUsers(users);
      return res.status(200).json({ key: k });
    }
  }
  return res.status(500).json({ error:'Failed to generate unique key' });
}
