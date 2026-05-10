import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.teamId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teamId = session.teamId;

    // 1. Fetch recent conversations (Threads)
    const recentThreads = await db.collection("conversations")
      .find({ teamId }, { sort: { updatedAt: -1 }, limit: 5 })
      .toArray();

    // 2. Fetch recent API keys
    const recentKeys = await db.collection("api_keys")
      .find({ teamId }, { sort: { createdAt: -1 }, limit: 3 })
      .toArray();

    // 3. Normalize into an activity feed
    const activities = [
      ...recentThreads.map(t => ({
        type: "thread",
        title: t.title,
        action: "updated thread",
        timestamp: t.updatedAt || t.createdAt,
        user: "Team Member" // In a real app, we would join with the user who made the change
      })),
      ...recentKeys.map(k => ({
        type: "key",
        title: k.label,
        action: "generated new API key",
        timestamp: k.createdAt,
        user: "Admin"
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ activities: activities.slice(0, 8) });
  } catch (error) {
    console.error("Failed to fetch team activity:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
