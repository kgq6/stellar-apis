export default async function handler(req, res) {
  const { number } = req.query;
  const apiKey = "b7e5c834b4c55202ff85124fba87f5f7";
  const url = `http://apilayer.net/api/validate?access_key=${apiKey}&number=${number}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch phone lookup" });
  }
}
