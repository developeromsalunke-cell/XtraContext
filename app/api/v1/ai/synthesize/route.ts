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

    const { focus } = await request.json();

    // SECURITY: Fetch authorized team IDs in memory due to Astra DB query limitations
    const { getAuthorizedTeamIds } = await import("@/lib/teams");
    const teamIds = await getAuthorizedTeamIds(session.userId);

    const threads = await db.collection("conversations")
      .find({ teamId: { $in: teamIds } })
      .sort({ updatedAt: -1 })
      .toArray();

    if (threads.length === 0) {
      return NextResponse.json({ synthesis: "No architectural memory found to synthesize." });
    }

    const context = threads.map(t => `- ${t.title}: ${t.description}`).join("\n");

    const prompt = `
You are a chief architectural synthesizer. Generate a high-level summary of the project's evolution and current state across all context threads.
${focus ? `FOCUS AREA: ${focus}` : ""}

THREADS TO SYNTHESIZE:
${context}

Output a professional executive summary in markdown.
    `;

    const synthesis = await askGroq(prompt);

    return NextResponse.json({ synthesis });
  } catch (error) {
    console.error("Synthesize error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
