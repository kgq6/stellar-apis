// GET ?limit=50
import { getChat } from '../_lib/storage.js';
export default async function handler(req, res) {
  const limit = Math.min(200, parseInt(req.query.limit || '50', 10));
  const chat = await getChat();
  const messages = (chat || []).slice(-limit);
  return res.status(200).json({ messages });
}
