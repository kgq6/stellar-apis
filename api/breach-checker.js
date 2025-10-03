export default async function handler(req, res) {
  const { email } = req.query;
  const apiKey = "59mrhcUaPllyw7T1j3UD3kuZ";
  const url = `https://api.anymailfinder.com/v4.0/search/email?email=${email}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to check breach" });
  }
}
