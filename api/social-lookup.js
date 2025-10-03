export default async function handler(req, res) {
  const { username } = req.query;

  const platforms = {
    twitter: `https://twitter.com/${username}`,
    instagram: `https://www.instagram.com/${username}`,
    github: `https://github.com/${username}`,
    snapchat: `https://www.snapchat.com/add/${username}`,
    gunslol: `https://guns.lol/${username}`,
    facebook: `https://www.facebook.com/${username}`
  };

  // For demo: just return the links
  res.status(200).json({ username, platforms });
}
