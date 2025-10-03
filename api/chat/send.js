// POST { key, text }
import { getChat, saveChat } from '../_lib/storage.js';
import { getUsers } from '../_lib/storage.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed' });
  const { key, text } = req.body;
  if (!key || !text) return res.status(400).json({ error:'Missing params' });
  const users = await getUsers();
  if (!users[key]) return res.status(404).json({ error:'Key not found' });
  const chat = await getChat();
  const entry = { ts: Date.now(), keyMask: (key || '----').slice(-4).padStart(4,'*'), text };
  chat.push(entry);
  if (chat.length > 500) chat.shift();
  await saveChat(chat);
  return res.status(200).json({ ok:true });
}
