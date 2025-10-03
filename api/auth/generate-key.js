// api/auth/generate-key.js
import { getUsers, saveUsers } from '../_lib/storage.js';

function genKeyOnce() {
  const rand4 = () => Math.floor(1000 + Math.random() * 9000).toString();
  return `${rand4()}-${rand4()}-${rand4()}-${rand4()}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed' });

  const users = await getUsers();

  // ensure unique key
  let key;
  for (let i=0;i<10;i++) {
    key = genKeyOnce();
    if (!users[key]) break;
  }

  if (!key) return res.status(500).json({ error:'Failed to generate key' });

  users[key] = {
    key,
    total: 0,
    remaining: 1000,
    history: [],
    created: Date.now(),
    activeSince: Date.now()
  };

  await saveUsers(users);

  res.status(200).json({ key });
}
