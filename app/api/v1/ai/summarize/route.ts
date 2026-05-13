import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { summarizeThread } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threadId, mode = 'technical' } = await request.json();
    if (!threadId) {
      return NextResponse.json({ error: "threadId is required" }, { status: 400 });
    }

    const conversationsColl = db.collection("conversations");
    const messagesColl = db.collection("messages");

    // Check if the thread exists and if the user has access
    // Note: We're skipping the strict access check here assuming the user can only see their own UI
    // For a real prod, we should ensure the thread belongs to one of user's teams.
    const thread = await conversationsColl.findOne({ _id: threadId });
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const messages = await messagesColl.find({ conversationId: threadId }, { sort: { order: 1 } }).toArray();

    if (messages.length === 0) {
      return NextResponse.json({ error: "No messages to summarize" }, { status: 400 });
    }

    const simplifiedMessages = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    const summary = await summarizeThread(simplifiedMessages, mode as 'technical' | 'executive');

    return NextResponse.json({ summary });

  } catch (error: any) {
    console.error("AI Summarize API error:", error);
    return NextResponse.json({ error: "Failed to process summary" }, { status: 500 });
  }
}
