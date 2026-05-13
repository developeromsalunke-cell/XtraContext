import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;
    const teamsColl = db.collection("teams");
    const conversationsColl = db.collection("conversations");
    const messagesColl = db.collection("messages");

    const allTeams = await teamsColl.find({}).toArray();
    const userTeamIds = allTeams
      .filter(team => team.members?.some((m: any) => m.userId === userId))
      .map(team => team._id);

    if (userTeamIds.length === 0) {
      return NextResponse.json({ 
        totalTokens: 0, 
        totalCost: 0, 
        mostActiveThreads: [],
        messagesPerDay: []
      });
    }

    // Fetch conversations
    const conversations = await conversationsColl.find(
      { teamId: { $in: userTeamIds } }
    ).toArray();

    const conversationIds = conversations.map(c => c._id);

    let messages: any[] = [];
    if (conversationIds.length > 0) {
      messages = await messagesColl.find(
        { conversationId: { $in: conversationIds } }
      ).toArray();
    }

    // Calculate analytics
    let totalTokens = 0;
    let totalCost = 0;
    const threadActivity: Record<string, number> = {};
    const dateActivity: Record<string, number> = {};

    messages.forEach(msg => {
      totalTokens += (msg.tokenCount || 0);
      totalCost += (msg.cost || 0);
      
      const convId = msg.conversationId;
      threadActivity[convId] = (threadActivity[convId] || 0) + 1;

      const dateStr = new Date(msg.createdAt || Date.now()).toISOString().split('T')[0];
      dateActivity[dateStr] = (dateActivity[dateStr] || 0) + 1;
    });

    // Most active threads
    const mostActiveThreads = Object.entries(threadActivity)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => {
        const t = conversations.find(c => c._id === id);
        return {
          id,
          title: t?.title || 'Unknown Thread',
          messageCount: count
        };
      });

    // Messages per day
    const messagesPerDay = Object.entries(dateActivity)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, count]) => ({ date, count }));

    return NextResponse.json({ 
      totalTokens, 
      totalCost, 
      mostActiveThreads,
      messagesPerDay
    });
  } catch (error: any) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
