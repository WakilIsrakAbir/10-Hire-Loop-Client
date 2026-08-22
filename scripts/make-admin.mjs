import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://wakilisrakabir_db_user:WYBPYwsrYAgruzLY@cluster0.ghzpy7c.mongodb.net/?appName=Cluster0";
const dbName = process.env.AUTH_DB_NAME || "hireloop_db";

const emailArg = process.argv[2];

if (!emailArg) {
  console.log("\n❌ Please provide an email address.");
  console.log("Usage: node scripts/make-admin.mjs <user-email>\n");
  console.log("Example: node scripts/make-admin.mjs admin@example.com\n");
  process.exit(1);
}

async function makeAdmin() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection("user");

    const targetEmail = emailArg.trim().toLowerCase();

    const user = await usersCollection.findOne({
      email: { $regex: new RegExp(`^${targetEmail}$`, "i") },
    });

    if (!user) {
      console.log(`\n❌ User with email "${emailArg}" was not found in the database.`);
      console.log("👉 Please register first at /register, then run this command.\n");
      process.exit(1);
    }

    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { role: "admin" } }
    );

    console.log(`\n✅ SUCCESS! User "${user.name || targetEmail}" (${targetEmail}) is now an ADMIN!`);
    console.log("👉 Now log in at http://localhost:3000/login with this account to access the Admin Console.\n");
  } catch (error) {
    console.error("\n❌ Error connecting to database:", error.message);
  } finally {
    await client.close();
  }
}

makeAdmin();
