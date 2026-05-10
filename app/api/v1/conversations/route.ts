import { db } from "@/lib/db";
import { z } from "zod";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "@/lib/session";

const conversationSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  teamId: z.string().optional(),
  messages: z.array(z.object({
    role: z.enum(["USER", "ASSISTANT", "SYSTEM", "TOOL"]),
    content: z.string(),
    tokenCount: z.number().optional(),
    cost: z.number().optional(),
  })).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = conversationSchema.parse(body);

    const convId = uuidv4();
    const conversationsColl = db.collection("conversations");
    const messagesColl = db.collection("messages");

    const messagesToInsert = data.messages || [];
    const targetTeamId = data.teamId || session.teamId;

    if (!targetTeamId) {
      return NextResponse.json({ error: "No team assigned" }, { status: 400 });
    }

    // 1. Create Context Thread (formerly Conversation)
    await conversationsColl.insertOne({
      _id: convId,
      teamId: targetTeamId,
      title: data.title,
      description: data.description || "",
      messageCount: messagesToInsert.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 2. Create Messages if any
    if (messagesToInsert.length > 0) {
      const messageDocs = messagesToInsert.map((m, i) => ({
        _id: uuidv4(),
        conversationId: convId,
        role: m.role,
        content: m.content,
        tokenCount: m.tokenCount || 0,
        cost: m.cost || 0,
        order: i,
        createdAt: new Date(),
      }));

      await messagesColl.insertMany(messageDocs);
    }

    return NextResponse.json({ success: true, conversationId: convId });
  } catch (error: any) {
    console.error("Context Thread creation error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}


export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;
    const teamsColl = db.collection("teams");
    const conversationsColl = db.collection("conversations");

    // 1. Find all teams the user is a member of
    const allTeams = await teamsColl.find({}).toArray();
    const userTeamIds = allTeams
      .filter(team => team.members?.some((m: any) => m.userId === userId))
      .map(team => team._id);

    if (userTeamIds.length === 0) {
      return NextResponse.json({ conversations: [] });
    }

    console.log(`[Conversations API] Fetching threads for ${userTeamIds.length} teams`);

    // 2. Fetch conversations for all those teams
    // Astra DB Data API supports $in operator
    const conversations = await conversationsColl.find(
      { teamId: { $in: userTeamIds } }, 
      { sort: { updatedAt: -1 }, limit: 50 }
    ).toArray();

    return NextResponse.json({ conversations });
  } catch (error: any) {
    console.error("Failed to fetch conversations:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}
