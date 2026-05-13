import { DataAPIClient } from "@datastax/astra-db-ts";
import "dotenv/config";

const endpoint = process.env.ASTRA_DB_API_ENDPOINT;
const token = process.env.ASTRA_DB_APPLICATION_TOKEN;

async function init() {
  if (!endpoint || !token) throw new Error("Missing credentials");

  const client = new DataAPIClient(token);
  const db = client.db(endpoint);

  const collections = ["users", "teams", "conversations", "messages", "api_keys", "projects", "context_states", "todos", "team_invitations"];

  console.log("Initializing Astra DB collections...");

  for (const name of collections) {
    try {
      await db.createCollection(name);
      console.log(`✓ Created collection: ${name}`);
    } catch (e: any) {
      if (e.message?.includes("already exists")) {
        console.log(`- Collection ${name} already exists`);
      } else {
        console.error(`! Failed to create ${name}:`, e.message);
      }
    }
  }

  console.log("Astra DB initialization complete.");
}

init();
