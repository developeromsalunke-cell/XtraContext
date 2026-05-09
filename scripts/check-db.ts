import { DataAPIClient } from "@datastax/astra-db-ts";
import "dotenv/config";

const endpoint = process.env.ASTRA_DB_API_ENDPOINT;
const token = process.env.ASTRA_DB_APPLICATION_TOKEN;

async function checkConnection() {
  if (!endpoint || !token) {
    console.error("❌ FAILED: Missing Astra DB credentials in .env");
    return;
  }

  console.log("🔍 Checking ContextVault Database Connection...");
  console.log(`📡 Endpoint: ${endpoint.substring(0, 30)}...`);

  try {
    const start = Date.now();
    const client = new DataAPIClient(token);
    const db = client.db(endpoint);

    // Attempt to list collections as a connectivity test
    const collections = await db.listCollections();
    const end = Date.now();

    console.log("✅ SUCCESS: Connected to Astra DB!");
    console.log(`⏱️ Latency: ${end - start}ms`);
    console.log("📦 Active Collections:");
    collections.forEach((col) => {
      console.log(`   - ${col.name}`);
    });

  } catch (error: any) {
    console.error("❌ FAILED: Could not connect to Astra DB.");
    console.error(`📝 Error: ${error.message}`);
  }
}

checkConnection();
