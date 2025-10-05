const jwt = require("jsonwebtoken");

export default async function handler(req, res) {
  const token = (req.headers.cookie || "")
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith("token="));
  if (!token) return res.status(200).json({ user: null });
  try {
    const raw = token.split("=")[1];
    const payload = jwt.verify(raw, process.env.JWT_SECRET || "dev_secret");
    res.json({ user: payload });
  } catch (err) {
    res.status(200).json({ user: null });
  }
}
