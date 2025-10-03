export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Missing username parameter" });
  }

  const platforms = {
    Twitter: `https://twitter.com/${username}`,
    Instagram: `https://www.instagram.com/${username}`,
    GitHub: `https://github.com/${username}`,
    Snapchat: `https://www.snapchat.com/add/${username}`,
    Facebook: `https://www.facebook.com/${username}`,
    Gunslol: `https://guns.lol/${username}`,
  };

  let results = {};

  for (const [platform, url] of Object.entries(platforms)) {
    try {
      const response = await fetch(url, { method: "GET" });
      const text = await response.text();

      let exists = false;

      // --- Simple detection rules ---
      if (response.status === 200) {
        if (platform === "Twitter" && text.includes("Sorry, that page doesn’t exist!")) {
          exists = false;
        } else if (platform === "Instagram" && (
            text.includes("Sorry, this page isn't available.") ||
            text.includes("The link you followed may be broken"))) {
          exists = false;
        } else if (platform === "GitHub" && text.includes("Join GitHub")) {
          exists = false;
        } else if (platform === "Facebook" && (
            text.includes("Page Not Found") ||
            text.includes("content isn't available") ||
            text.includes("You must log in"))) {
          exists = false;
        } else if (platform === "Snapchat" && text.includes("Couldn't find")) {
          exists = false;
        } else if (platform === "Gunslol" && text.includes("User not found")) {
          exists = false;
        } else {
          exists = true;
        }
      }

      results[platform] = exists ? { exists: true, url } : { exists: false };

    } catch (err) {
      results[platform] = { error: "⚠️ Error checking" };
    }
  }

  res.status(200).json({
    username,
    results
  });
}
