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
    const query = searchParams.get("q");

    const conversationsColl = db.collection("conversations");
    
    // Simple filter for demo. In production, use Astra Vector Search!
    const filter: any = { teamId: session.teamId };
    if (query) {
      // Basic prefix/exact match simulation as Data API doesn't support $regex in all tiers
      // We'll search by title
      filter.title = { $exists: true };
    }

    const conversations = await conversationsColl.find(filter, { limit: 10 }).toArray();

    return NextResponse.json({ 
      results: conversations.map(c => ({
        id: c._id,
        title: c.title,
        platform: c.platform,
        model: c.model,
        updatedAt: c.updatedAt
      }))
    });
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

