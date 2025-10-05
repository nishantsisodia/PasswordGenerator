const { connectToDatabase } = require("../../../lib/mongodb");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

function getUserIdFromReq(req) {
  const token = (req.headers.cookie || "")
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith("token="));
  if (!token) return null;
  try {
    const raw = token.split("=")[1];
    const payload = jwt.verify(raw, process.env.JWT_SECRET || "dev_secret");
    return payload.id;
  } catch (e) {
    return null;
  }
}

export default async function handler(req, res) {
  const userId = getUserIdFromReq(req);
  if (!userId) return res.status(401).json({ error: "Auth required" });
  const { db } = await connectToDatabase();
  if (req.method === "GET") {
    const rows = await db
      .collection("vault")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    return res.json(rows);
  }
  if (req.method === "POST") {
    const { title, blob } = req.body || {};
    if (!blob) return res.status(400).json({ error: "Missing blob" });
    const doc = {
      userId,
      title: title || "Untitled",
      blob,
      createdAt: new Date(),
    };
    const r = await db.collection("vault").insertOne(doc);
    res.status(201).json({ ...doc, _id: r.insertedId });
  }
  res.status(405).end();
}
