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

    const conversationsColl = db.collection("conversations");
    
    // We'll perform a broad search for the team's threads
    // In a production scenario with large data, we would use Vector Search ($vector)
    const filter: any = { teamId: session.teamId };
    
    // Fetch recent threads to filter client-side or use prefix matching if supported
    // For now, we'll fetch the most recent 100 threads and filter by title/description
    const conversations = await conversationsColl.find(filter, { 
      sort: { updatedAt: -1 },
      limit: 100 
    }).toArray();

    const filteredResults = conversations.filter(c => {
      const searchStr = `${c.title} ${c.description} ${c.model}`.toLowerCase();
      return searchStr.includes(query.toLowerCase());
    });

    return NextResponse.json({ 
      results: filteredResults.slice(0, 10).map(c => ({
        id: c._id,
        title: c.title,
        description: c.description,
        model: c.model,
        updatedAt: c.updatedAt
      }))
    });
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
