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

    // 3. Resolve Authorized Teams (Global Access)
    let authorizedTeamIds: any[] = [authContext.teamId];
    
    // If the key has a userId, we fetch all teams they belong to
    if (authContext.userId && authContext.userId !== "system") {
       const allTeams = await db.collection("teams").find({}).toArray();
       const userTeams = allTeams
         .filter(t => t.members?.some((m: any) => m.userId === authContext.userId))
         .map(t => t._id);
       
       if (userTeams.length > 0) {
         authorizedTeamIds = userTeams;
       }
    }

    console.log(`[MCP Proxy] User: ${authContext.userId} | Action: ${action} | Teams: ${authorizedTeamIds.length}`);

    const conversationsColl = db.collection("conversations");
    
    switch (action) {
      case "search":
        const { query } = params;
        
        // A. Check if the query is an exact Thread ID (UUID)
        if (query && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(query)) {
           const exactMatch = await conversationsColl.findOne({ 
              _id: query, 
              teamId: { $in: authorizedTeamIds } 
           });
           if (exactMatch) return NextResponse.json({ results: [exactMatch] });
        }

        // B. General Semantic/Keyword Search
        const cursor = conversationsColl.find(
          { teamId: { $in: authorizedTeamIds } }, 
          { limit: 20, sort: { updatedAt: -1 } }
        );
        const allResults = await cursor.toArray();
        
        const filteredResults = query 
          ? allResults.filter(r => {
              const title = (r.title || "").toLowerCase();
              const desc = (r.description || "").toLowerCase();
              return title.includes(query.toLowerCase()) || desc.includes(query.toLowerCase());
            })
          : allResults;
          
        return NextResponse.json({ results: filteredResults.slice(0, 5) });

      case "log":
        const { conversation } = params;
        const conversationToInsert = {
          ...conversation,
          teamId: params.teamId || authContext.teamId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const insertResult = await conversationsColl.insertOne(conversationToInsert);
        return NextResponse.json({ success: true, id: insertResult.insertedId });

      case "append_message":
        const { threadId, message } = params;
        if (!threadId || !message) throw new ValidationError("Missing threadId or message");

        // Verify thread belongs to any of the user's authorized teams
        const thread = await conversationsColl.findOne({ 
          _id: threadId, 
          teamId: { $in: authorizedTeamIds } 
        });
        
        if (!thread) {
           console.log(`[MCP Proxy] Authorization Failed for thread ${threadId}. User teams: ${authorizedTeamIds}`);
           throw new NotFoundError("Context thread not found or unauthorized access.");
        }

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

        await conversationsColl.updateOne(
          { _id: threadId },
          { 
            $set: { updatedAt: new Date() },
            $inc: { messageCount: 1 } 
          }
        );

        return NextResponse.json({ success: true, messageId });

      case "list_threads":
        const threads = await conversationsColl
          .find({ teamId: { $in: authorizedTeamIds } })
          .sort({ updatedAt: -1 })
          .limit(20)
          .toArray();
        return NextResponse.json({ threads });

      case "get_messages":
        const { threadId: tid } = params;
        if (!tid) throw new ValidationError("Missing threadId");
        
        const threadCheck = await conversationsColl.findOne({ _id: tid, teamId: { $in: authorizedTeamIds } });
        if (!threadCheck) throw new NotFoundError("Unauthorized access to thread history.");

        const messages = await db.collection("messages")
          .find({ conversationId: tid })
          .sort({ order: 1 })
          .toArray();
        return NextResponse.json({ messages });

      case "list_todos":
        const todos = await db.collection("todos")
          .find({ teamId: { $in: authorizedTeamIds } })
          .sort({ createdAt: -1 })
          .toArray();
        return NextResponse.json({ todos });

      case "update_thread":
        const { id, updates } = params;
        if (!id || !updates) throw new ValidationError("Missing id or updates");

        const updateResult = await conversationsColl.updateOne(
          { _id: id, teamId: { $in: authorizedTeamIds } },
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
