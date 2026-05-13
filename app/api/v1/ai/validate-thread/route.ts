import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { askGroq } from "@/lib/groq";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threadId } = await request.json();
    if (!threadId) {
      return NextResponse.json({ error: "Missing threadId" }, { status: 400 });
    }

    const conversationsColl = db.collection("conversations");
    const currentThread = await conversationsColl.findOne({ _id: threadId });
    
    if (!currentThread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // Fetch newer threads to check for contradictions
    const newerThreads = await conversationsColl
      .find(
        { 
          teamId: currentThread.teamId,
          createdAt: { $gt: currentThread.createdAt }
        },
        { sort: { createdAt: -1 }, limit: 10 }
      )
      .toArray();

    if (newerThreads.length === 0) {
      return NextResponse.json({ 
        status: "VALID", 
        message: "No newer threads found to contradict this decision." 
      });
    }

    const newerContext = newerThreads.map(t => `Thread: ${t.title}\nContext: ${t.description}`).join("\n\n");

    const prompt = `
You are a memory vault maintenance agent. Your job is to detect if an old decision has been superseded or contradicted by newer information.

OLD DECISION:
Title: ${currentThread.title}
Description: ${currentThread.description}

NEWER INFORMATION:
${newerContext}

Has the old decision been superseded, contradicted, or made obsolete by the newer information?
Reply with "DEPRECATED: [Reason]" if it is obsolete.
Otherwise reply with "VALID".
    `;

    const result = await askGroq(prompt);

    if (result.startsWith("DEPRECATED:")) {
      await conversationsColl.updateOne(
        { _id: threadId },
        { $set: { importance: "deprecated", updatedAt: new Date() } }
      );
      return NextResponse.json({ status: "DEPRECATED", message: result });
    }

    return NextResponse.json({ status: "VALID", message: "Decision remains consistent with newer project history." });
  } catch (error: any) {
    console.error("Validate thread error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
