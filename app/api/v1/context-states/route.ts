import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // SECURITY: Fetch authorized team IDs in memory due to Astra DB query limitations
    const { getAuthorizedTeamIds } = await import("@/lib/teams");
    const userId = session.userId;
    const authorizedTeamIds = await getAuthorizedTeamIds(userId);

    if (authorizedTeamIds.length === 0) {
      return NextResponse.json({ snapshots: [] });
    }

    // 2. Fetch snapshots ONLY for authorized teams
    const contextStatesColl = db.collection("context_states");
    const snapshots = await contextStatesColl.find(
       { teamId: { $in: authorizedTeamIds } }, 
       { sort: { version: -1 }, limit: 50 }
    ).toArray();

    return NextResponse.json({ snapshots });
  } catch (error: any) {
    console.error("Context states API error:", error);
    return NextResponse.json({ error: "Failed to fetch snapshots" }, { status: 500 });
  }
}
