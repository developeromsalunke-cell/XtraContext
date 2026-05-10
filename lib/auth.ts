/**
 * XtraContext — API Key Authentication
 * Extracts Bearer token, looks up by prefix, then bcrypt-verifies the hash.
 */

import { compare, hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { AuthError } from "@/lib/errors";
import type { AuthContext } from "@/lib/types";

/** The key prefix length used for fast DB lookup (e.g., "xc_a1b2c3d4") */
const KEY_PREFIX_LENGTH = 12;

/**
 * Authenticate an incoming request using the API key in the Authorization header.
 *
 * Key format: "xc_<random>" where the first 12 characters are stored as a prefix
 * for fast lookup, and the full key is hashed with bcrypt.
 *
 * @param request - The incoming HTTP request
 * @returns AuthContext with team, user, and role information
 * @throws AuthError if authentication fails
 */
export async function authenticateApiKey(
  request: Request
): Promise<AuthContext> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    throw new AuthError("Missing Authorization header");
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new AuthError("Invalid Authorization header format. Expected: Bearer <api_key>");
  }

  const rawKey = parts[1];
  if (!rawKey || rawKey.length < KEY_PREFIX_LENGTH) {
    throw new AuthError("Invalid API key format");
  }

  const prefix = rawKey.substring(0, KEY_PREFIX_LENGTH);

  // Look up the API key by its prefix in Astra DB
  const apiKeysCol = db.collection("api_keys");
  const apiKey = await apiKeysCol.findOne({ prefix });

  if (!apiKey) {
    throw new AuthError("INVALID_API_KEY");
  }

  // Verify the full key against the stored hash
  const isValid = await compare(rawKey, apiKey.keyHash);
  if (!isValid) {
    throw new AuthError("Invalid API key");
  }

  // Update last used timestamp in Astra DB (fire-and-forget)
  db.collection("api_keys")
    .updateOne(
      { _id: apiKey._id },
      { $set: { lastUsedAt: new Date() } }
    )
    .catch((err: unknown) => {
      console.error("[XtraContext] Failed to update API key lastUsedAt:", err);
    });

  return {
    teamId: apiKey.teamId,
    teamPlan: apiKey.teamPlan || "FREE",
    userId: apiKey.userId || "system",
    role: "DEVELOPER",
    apiKeyId: String(apiKey._id),
  };
}

/**
 * Generates a new random API key.
 * Format: xc_<random_hex_32_chars>
 */
export function generateApiKey(): string {
  const randomPart = randomBytes(16).toString("hex");
  return `xc_${randomPart}`;
}

/**
 * Hashes a raw API key using bcrypt.
 */
export async function hashApiKey(rawKey: string): Promise<string> {
  return await hash(rawKey, 10);
}

/**
 * Creates a new API key in the database for a team.
 * @returns The raw API key (to be shown once to the user)
 */
export async function createApiKey(teamId: string, userId: string, label: string): Promise<string> {
  const rawKey = generateApiKey();
  const keyHash = await hashApiKey(rawKey);
  const prefix = rawKey.substring(0, KEY_PREFIX_LENGTH);

  await db.collection("api_keys").insertOne({
    teamId,
    userId,
    keyHash,
    prefix,
    label,
    createdAt: new Date(),
    revokedAt: null,
  });

  return rawKey;
}
