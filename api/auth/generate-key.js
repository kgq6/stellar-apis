// api/auth/generate-key.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Generate random 16-digit key in 4-4-4-4 format
  const rand4 = () => Math.floor(1000 + Math.random() * 9000).toString();
  const key = `${rand4()}-${rand4()}-${rand4()}-${rand4()}`;

  return res.status(200).json({ key });
}
