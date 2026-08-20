import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(
  process.env.MONGODB_URI || process.env.MONGODB_URL
);
const db = client.db(process.env.AUTH_DB_NAME || "hireloop_db");

export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "seeker",
        input: true,
      },
      companyName: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  emailAndPassword: { 
    enabled: true,
    minPasswordLength: 6,
  }, 
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
});