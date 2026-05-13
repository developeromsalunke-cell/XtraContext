import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { generateADR } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threadIds, format = 'adr' } = await request.json();
    if (!threadIds || !Array.isArray(threadIds) || threadIds.length === 0) {
      return NextResponse.json({ error: "threadIds array is required" }, { status: 400 });
    }

    const conversationsColl = db.collection("conversations");
    const messagesColl = db.collection("messages");

    // Fetch the threads
    const threads = await conversationsColl.find({ _id: { $in: threadIds } }).toArray();
    
    if (threads.length === 0) {
      return NextResponse.json({ error: "No threads found" }, { status: 404 });
    }

    // Fetch messages for these threads
    const messages = await messagesColl.find({ conversationId: { $in: threadIds } }, { sort: { order: 1 } }).toArray();

    if (messages.length === 0) {
      return NextResponse.json({ error: "No messages found to generate documentation from" }, { status: 400 });
    }

    // Combine threads and messages
    const threadData = threads.map(t => {
      const tMessages = messages.filter(m => m.conversationId === t._id).map(m => ({
        role: m.role,
        content: m.content
      }));
      return {
        title: t.title,
        description: t.description,
        messages: tMessages
      };
    });

    const markdown = await generateADR(threadData, format as 'adr' | 'onboarding' | 'changelog');

    return NextResponse.json({ markdown });

  } catch (error: any) {
    console.error("AI Generate Doc API error:", error);
    return NextResponse.json({ error: "Failed to generate documentation" }, { status: 500 });
  }
}
