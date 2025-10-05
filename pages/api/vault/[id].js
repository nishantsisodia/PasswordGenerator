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
    return jwt.verify(
      token.split("=")[1],
      process.env.JWT_SECRET || "dev_secret"
    ).id;
  } catch (e) {
    return null;
  }
}

export default async function handler(req, res) {
  const userId = getUserIdFromReq(req);
  if (!userId) return res.status(401).json({ error: "Auth required" });
  const { db } = await connectToDatabase();
  const { id } = req.query;
  if (!ObjectId.isValid(id))
    return res.status(400).json({ error: "Invalid id" });
  const oid = new ObjectId(id);
  if (req.method === "DELETE") {
    await db.collection("vault").deleteOne({ _id: oid, userId });
    return res.json({ ok: true });
  }
  if (req.method === "PUT") {
    const { title, blob } = req.body || {};
    await db
      .collection("vault")
      .updateOne(
        { _id: oid, userId },
        { $set: { title, blob, updatedAt: new Date() } }
      );
    return res.json({ ok: true });
  }
  res.status(405).end();
}
