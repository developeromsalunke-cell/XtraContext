import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;
    const teamsColl = db.collection("teams");
    const conversationsColl = db.collection("conversations");

    // 1. Fetch authorized teams
    const allTeams = await teamsColl.find({}).toArray();
    const userTeams = allTeams.filter(team => 
      team.members?.some((m: any) => m.userId === userId)
    );
    const userTeamIds = userTeams.map(team => team._id);

    if (userTeamIds.length === 0) {
      return NextResponse.json({ nodes: [], links: [] });
    }

    // 2. Fetch conversations for these teams
    const conversations = await conversationsColl.find(
      { teamId: { $in: userTeamIds } },
      { sort: { updatedAt: -1 }, limit: 100 }
    ).toArray();

    // 3. Build Nodes
    const nodes: any[] = [];
    const links: any[] = [];

    // Add team nodes
    userTeams.forEach(team => {
      nodes.push({
        id: team._id,
        label: team.name,
        type: "team",
        val: 20
      });
    });

    // Add conversation nodes (Threads) and links
    conversations.forEach(conv => {
      nodes.push({
        id: conv._id,
        label: conv.title || 'Untitled Thread',
        type: "thread",
        val: 10,
        model: conv.model
      });

      // Link thread to its team
      links.push({
        source: conv._id,
        target: conv.teamId
      });
    });

    // Add Virtual Nodes for Models to cluster conversations
    const models = [...new Set(conversations.map(c => c.model).filter(Boolean))];
    models.forEach(model => {
      const modelNodeId = `model-${model}`;
      nodes.push({
        id: modelNodeId,
        label: model,
        type: 'model',
        val: 15
      });

      // Link conversations to their model
      conversations.filter(c => c.model === model).forEach(conv => {
        links.push({
          source: conv._id,
          target: modelNodeId
        });
      });
    });

    return NextResponse.json({ nodes, links });
  } catch (error: any) {
    console.error("Graph API error:", error);
    return NextResponse.json({ error: "Failed to fetch graph data" }, { status: 500 });
  }
}
