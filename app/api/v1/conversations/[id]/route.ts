import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.teamId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const conversationsColl = db.collection("conversations");
    const messagesColl = db.collection("messages");

    // 1. Fetch Conversation
    const conversation = await conversationsColl.findOne({
      _id: id,
      teamId: session.teamId, // Ensure it belongs to the user's team
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // 2. Fetch Messages
    const cursor = messagesColl.find({ conversationId: id }, { sort: { order: 1 } });
    const messages = await cursor.toArray();

    return NextResponse.json({
      conversation,
      messages,
    });
  } catch (error: any) {
    console.error("Failed to fetch conversation details:", error);
    return NextResponse.json({ error: "Failed to fetch conversation" }, { status: 500 });
  }
}
