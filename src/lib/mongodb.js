import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || process.env.MONGODB_URL || "mongodb://localhost:27017";
const dbName = process.env.AUTH_DB_NAME || "hireloop_db";

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDatabase() {
  const client = await clientPromise;
  return client.db(dbName);
}

export default clientPromise;
