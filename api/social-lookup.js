export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Missing username parameter" });
  }

  // Platforms and their profile URL patterns
  const platforms = {
    Twitter: `https://twitter.com/${username}`,
    Instagram: `https://www.instagram.com/${username}`,
    GitHub: `https://github.com/${username}`,
    Snapchat: `https://www.snapchat.com/add/${username}`,
    Facebook: `https://www.facebook.com/${username}`,
    Gunslol: `https://guns.lol/${username}`,
  };

  let results = {};

  // Loop through platforms
  for (const [platform, url] of Object.entries(platforms)) {
    try {
      const response = await fetch(url, { method: "GET" });

      // If 200 → account exists, if 404 → doesn't exist
      if (response.status === 200) {
        results[platform] = { exists: true, url };
      } else if (response.status === 404) {
        results[platform] = { exists: false };
      } else {
        results[platform] = { exists: "unknown", status: response.status };
      }
    } catch (err) {
      results[platform] = { error: "⚠️ Error checking" };
    }
  }

  res.status(200).json({
    username,
    results
  });
}
