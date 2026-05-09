/**
 * ContextVault MCP Proxy Layer
 * 
 * This endpoint acts as a secure intermediary between the MCP Server and Astra DB.
 * It validates user-generated Access Tokens and forwards authorized requests.
 */

import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, UnauthorizedError, ValidationError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate using Access Token (Bearer xc_...)
    const authContext = await authenticateApiKey(request);
    
    // 2. Validate Proxy Action
    const body = await request.json();
    const { action, params } = body;

    if (!action) {
      throw new ValidationError("Missing proxy action");
    }

    // 3. Forward to Astra DB Collection
    const conversationsColl = db.collection("conversations");
    
    switch (action) {
      case "search":
        const { query } = params;
        // Basic metadata search filtered by team
        const cursor = conversationsColl.find(
          { teamId: authContext.teamId }, 
          { limit: 5, sort: { updatedAt: -1 } }
        );
        const results = await cursor.toArray();
        return NextResponse.json({ results });

      case "log":
        const { conversation } = params;
        // Ensure teamId matches authenticated user
        const conversationToInsert = {
          ...conversation,
          teamId: authContext.teamId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const insertResult = await conversationsColl.insertOne(conversationToInsert);
        return NextResponse.json({ success: true, id: insertResult.insertedId });

      default:
        throw new ValidationError(`Unknown proxy action: ${action}`);
    }

  } catch (error) {
    console.error("[MCP Proxy Error]:", error);
    return handleApiError(error);
  }
}
