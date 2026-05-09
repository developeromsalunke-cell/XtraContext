import { DataAPIClient } from "@datastax/astra-db-ts";

const endpoint = process.env.ASTRA_DB_API_ENDPOINT;
const token = process.env.ASTRA_DB_APPLICATION_TOKEN;

if (!endpoint || !token) {
  throw new Error("Missing Astra DB credentials in environment variables.");
}

// Initialize the Astra Data API client (Core Engine)
const astraClient = new DataAPIClient(token);
export const db = astraClient.db(endpoint);

/**
 * Helper to get a collection by name
 * @param name - The name of the collection
 */
export function getCollection(name: string) {
  return db.collection(name);
}

// Log connection status in development
if (process.env.NODE_ENV === "development") {
  db.listCollections().then((colls) => {
    console.log("Connected to AstraDB collections:", colls.map(c => c.name).join(", "));
  }).catch(err => {
    console.error("Failed to connect to AstraDB:", err);
  });
}
