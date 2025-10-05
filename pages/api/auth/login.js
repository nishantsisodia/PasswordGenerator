const { connectToDatabase } = require("../../../lib/mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Missing" });
  const { db } = await connectToDatabase();
  const user = await db.collection("users").findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid" });
  const payload = { id: user._id.toString(), email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET || "dev_secret", {
    expiresIn: "7d",
  });
  res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; SameSite=Lax`);
  res.json({ user: payload });
}
