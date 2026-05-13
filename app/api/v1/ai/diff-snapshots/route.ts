import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { askGroq } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contentA, contentB } = await request.json();
    if (!contentA || !contentB) {
      return NextResponse.json({ error: "Missing contentA or contentB" }, { status: 400 });
    }

    const prompt = `
You are an expert architectural analyst. Compare these two project snapshots and summarize what changed.
Focus on high-level architectural shifts, new dependencies, structural changes, or removed patterns.

SNAPSHOT A (Older):
${contentA.substring(0, 4000)}

SNAPSHOT B (Newer):
${contentB.substring(0, 4000)}

Provide a clear, concise markdown summary of the architectural evolution between these snapshots.
    `;

    const summary = await askGroq(prompt);

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("Diff AI error:", error);
    return NextResponse.json({ error: "Failed to generate diff" }, { status: 500 });
  }
}
