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
  // Set cookie for 7 days; only set Secure in production so it works on localhost
  const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const maxAge = 60 * 60 * 24 * 7; // 7 days in seconds
  const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${secureFlag}`;
  res.setHeader("Set-Cookie", cookie);
  res.json({ user: payload });
}
