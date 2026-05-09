/**
 * ContextVault MCP Proxy Layer
 * 
 * This endpoint acts as a secure intermediary between the MCP Server and Astra DB.
 * It validates user-generated Access Tokens and forwards authorized requests.
 */

import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, AuthError, ValidationError, NotFoundError } from "@/lib/errors";
import { v4 as uuidv4 } from "uuid";

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

      case "append_message":
        const { threadId, message } = params;
        if (!threadId || !message) throw new ValidationError("Missing threadId or message");

        // Verify thread belongs to team
        const thread = await conversationsColl.findOne({ _id: threadId, teamId: authContext.teamId });
        if (!thread) throw new NotFoundError("Context thread not found");

        const messagesColl = db.collection("messages");
        const messageId = uuidv4();
        
        await messagesColl.insertOne({
          _id: messageId,
          conversationId: threadId,
          role: message.role,
          content: message.content,
          tokenCount: message.tokenCount || 0,
          cost: message.cost || 0,
          order: (thread.messageCount || 0),
          createdAt: new Date(),
        });

        // Update thread metadata
        await conversationsColl.updateOne(
          { _id: threadId },
          { 
            $set: { updatedAt: new Date() },
            $inc: { messageCount: 1 } 
          }
        );

        return NextResponse.json({ success: true, messageId });

      case "update_thread":
        const { id, updates } = params;
        if (!id || !updates) throw new ValidationError("Missing id or updates");

        const updateResult = await conversationsColl.updateOne(
          { _id: id, teamId: authContext.teamId },
          { 
            $set: { 
              ...updates,
              updatedAt: new Date() 
            } 
          }
        );

        if (updateResult.matchedCount === 0) throw new NotFoundError("Thread not found or unauthorized");
        return NextResponse.json({ success: true });

      default:
        throw new ValidationError(`Unknown proxy action: ${action}`);
    }

  } catch (error) {
    console.error("[MCP Proxy Error]:", error);
    return handleApiError(error);
  }
}
