import { getUsers } from '../_lib/storage.js';
export default async function handler(req,res){
  // for security: require an admin token in header ADMIN_TOKEN (set in Vercel)
  if (process.env.ADMIN_TOKEN && req.headers['x-admin-token'] !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const users = await getUsers();
  return res.status(200).json({ count: Object.keys(users).length, users });
}
