import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.teamId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const queryLower = query.toLowerCase();

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const conversationsColl = db.collection("conversations");
    const messagesColl = db.collection("messages");

    // 1. Fetch all conversations for the team (limited for performance in this basic search)
    const teamConversations = await conversationsColl.find({
      teamId: session.teamId
    }).toArray();

    const conversationIds = teamConversations.map(c => c._id);
    if (conversationIds.length === 0) {
      return NextResponse.json({ results: [] });
    }

    // SECURITY: Use database-level regex filtering and projection to prevent memory exhaustion DoS
    const matchingMessages = await messagesColl.find(
      { 
        conversationId: { $in: conversationIds },
        content: { $regex: query, $options: "i" }
      },
      { 
        projection: { content: 1, role: 1, conversationId: 1, createdAt: 1 },
        limit: 100 
      }
    ).toArray();

    // 4. Also find conversations whose title matches the query
    const matchingConversations = teamConversations.filter(c => 
      c.title.toLowerCase().includes(queryLower) ||
      (c.description && c.description.toLowerCase().includes(queryLower))
    );

    // 5. Group everything by conversation
    const resultsMap = new Map<string, any>();

    // Add conversation matches
    matchingConversations.forEach(c => {
      resultsMap.set(c._id as string, {
        conversation: {
          id: c._id as string,
          title: c.title,
          platform: c.platform || "UNKNOWN",
          model: c.model || "UNKNOWN",
          createdAt: c.createdAt
        },
        matches: []
      });
    });

    // Add message matches (and their conversations if not already added)
    matchingMessages.forEach(m => {
      if (!resultsMap.has(m.conversationId as string)) {
        const conv = teamConversations.find(c => c._id === m.conversationId);
        if (conv) {
          resultsMap.set(m.conversationId as string, {
            conversation: {
              id: conv._id as string,
              title: conv.title,
              platform: conv.platform || "UNKNOWN",
              model: conv.model || "UNKNOWN",
              createdAt: conv.createdAt
            },
            matches: []
          });
        }
      }
      
      const result = resultsMap.get(m.conversationId as string);
      if (result) {
        result.matches.push({
          id: m._id as string,
          role: m.role,
          content: m.content,
          createdAt: m.createdAt
        });
      }
    });

    // Convert map to array and sort by most recent activity
    const results = Array.from(resultsMap.values())
      .sort((a, b) => new Date(b.conversation.createdAt).getTime() - new Date(a.conversation.createdAt).getTime())
      .slice(0, 20);

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

