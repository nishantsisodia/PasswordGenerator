const { connectToDatabase } = require("../../lib/mongodb");

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const users = await db.collection("users").countDocuments();
    const vaults = await db.collection("vault").countDocuments();
    res.json({ users, vaults });
  } catch (e) {
    res.json({ users: 0, vaults: 0 });
  }
}
