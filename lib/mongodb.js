const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "";
if (!uri) {
  console.warn("MONGODB_URI not set; API will fail until provided");
}

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return { client: cachedClient, db: cachedClient.db() };
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return { client, db: client.db() };
}

module.exports = { connectToDatabase };
