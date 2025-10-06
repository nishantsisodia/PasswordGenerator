const { connectToDatabase } = require("../../../lib/mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Missing" });
  const { db } = await connectToDatabase();
  const existing = await db.collection("users").findOne({ email });
  if (existing) return res.status(409).json({ error: "User exists" });
  const hash = await bcrypt.hash(password, 10);
  const result = await db
    .collection("users")
    .insertOne({ email, password: hash, createdAt: new Date() });
  const user = { id: result.insertedId.toString(), email };
  const token = jwt.sign(user, process.env.JWT_SECRET || "dev_secret", {
    expiresIn: "7d",
  });
  const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const maxAge = 60 * 60 * 24 * 7;
  const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${secureFlag}`;
  res.setHeader("Set-Cookie", cookie);
  res.status(201).json({ user });
}
