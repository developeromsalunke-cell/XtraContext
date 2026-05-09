/**
 * XtraContext — Sync API Route Handler
 *
 * POST /api/v1/sync — Push new context state (ADMIN, DEVELOPER)
 * GET  /api/v1/sync — Pull latest context state (ADMIN, DEVELOPER, VIEWER)
 */

import { type NextRequest } from "next/server";
import { z } from "zod";
import { createHash } from "crypto";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/lib/db";
import { authenticateApiKey } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { checkRateLimit, setRateLimitHeaders } from "@/lib/rate-limit";
import { handleApiError, NotFoundError, ValidationError } from "@/lib/errors";
import { RateLimitError } from "@/lib/errors";
import type { SyncPushResponse, SyncPullResponse } from "@/lib/types";

// =============================================================================
// Request Validation Schemas
// =============================================================================

const syncPushSchema = z.object({
  projectId: z.string().min(1, "projectId is required"),
  content: z.string().min(1, "content is required"),
  checksum: z.string().length(64, "checksum must be a 64-character SHA-256 hex digest"),
});

const syncPullSchema = z.object({
  projectId: z.string().min(1, "projectId is required"),
});

// =============================================================================
// POST /api/v1/sync — Push new context
// =============================================================================

export async function POST(request: NextRequest): Promise<Response> {
  try {
    // 1. Authenticate
    const authContext = await authenticateApiKey(request);

    // 2. Rate limit
    const rateLimitKey = `${authContext.apiKeyId}:sync:post`;
    const rateLimitResult = await checkRateLimit(rateLimitKey);
    if (!rateLimitResult.success) {
      throw new RateLimitError(rateLimitResult.resetAt - Date.now());
    }

    // 3. RBAC — only ADMIN and DEVELOPER can push
    requireRole(authContext, "ADMIN", "DEVELOPER");

    // 4. Validate request body
    const body: unknown = await request.json();
    const parseResult = syncPushSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new ValidationError(errorMessage);
    }
    const { projectId, content, checksum } = parseResult.data;

    // 5. Verify project belongs to the authenticated team
    const projectsColl = db.collection("projects");
    const project = await projectsColl.findOne({
      _id: projectId,
      teamId: authContext.teamId,
    });
    if (!project) {
      throw new NotFoundError("Project not found or does not belong to your team");
    }

    // 6. Compute server-side checksum and validate
    const serverChecksum = createHash("sha256").update(content, "utf-8").digest("hex");
    if (serverChecksum !== checksum) {
      throw new ValidationError(
        "Checksum mismatch: content integrity check failed. " +
        `Expected: ${checksum}, Got: ${serverChecksum}`
      );
    }

    // 7. Determine next version number
    const contextStateColl = db.collection("context_states");
    const latestState = await contextStateColl.findOne(
      { projectId },
      { sort: { version: -1 } }
    );
    const nextVersion = (latestState?.version ?? 0) + 1;

    // 8. Create new context state (immutable append)
    const newStateData = {
      _id: uuidv4(),
      projectId,
      version: nextVersion,
      content,
      checksum: serverChecksum,
      createdById: authContext.userId,
      createdAt: new Date(),
    };
    await contextStateColl.insertOne(newStateData);

    // 9. Build response
    const responseBody: SyncPushResponse = {
      version: nextVersion,
      checksum: serverChecksum,
      updatedAt: newStateData.createdAt.toISOString(),
    };

    const response = Response.json(responseBody, { status: 201 });
    setRateLimitHeaders(response.headers, rateLimitResult);
    return response;
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

// =============================================================================
// GET /api/v1/sync — Pull latest context
// =============================================================================

export async function GET(request: NextRequest): Promise<Response> {
  try {
    // 1. Authenticate
    const authContext = await authenticateApiKey(request);

    // 2. Rate limit
    const rateLimitKey = `${authContext.apiKeyId}:sync:get`;
    const rateLimitResult = await checkRateLimit(rateLimitKey);
    if (!rateLimitResult.success) {
      throw new RateLimitError(rateLimitResult.resetAt - Date.now());
    }

    // 3. RBAC — all roles can read
    requireRole(authContext, "ADMIN", "DEVELOPER", "VIEWER");

    // 4. Validate query parameters
    const projectId = request.nextUrl.searchParams.get("projectId");
    const parseResult = syncPullSchema.safeParse({ projectId });
    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new ValidationError(errorMessage);
    }

    // 5. Verify project belongs to the authenticated team
    const projectsColl = db.collection("projects");
    const project = await projectsColl.findOne({
      _id: parseResult.data.projectId,
      teamId: authContext.teamId,
    });
    if (!project) {
      throw new NotFoundError("Project not found or does not belong to your team");
    }

    // 6. Fetch latest context state
    const contextStateColl = db.collection("context_states");
    const latestState = await contextStateColl.findOne(
      { projectId: parseResult.data.projectId },
      { sort: { version: -1 } }
    );
    if (!latestState) {
      throw new NotFoundError("No context state found for this project. Push an initial version first.");
    }

    // 7. Build response
    const responseBody: SyncPullResponse = {
      version: latestState.version,
      content: latestState.content,
      checksum: latestState.checksum,
      updatedAt: (latestState.createdAt as Date).toISOString(),
    };

    const response = Response.json(responseBody, { status: 200 });
    setRateLimitHeaders(response.headers, rateLimitResult);
    return response;
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
