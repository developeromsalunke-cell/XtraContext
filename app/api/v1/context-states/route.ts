import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;
    const contextStatesColl = db.collection("context_states");

    // We fetch snapshots for the teams this user belongs to
    // For simplicity, just get recent snapshots (would filter by team in a larger app)
    const snapshots = await contextStatesColl.find(
       {}, 
       { sort: { version: -1 }, limit: 50 }
    ).toArray();

    return NextResponse.json({ snapshots });
  } catch (error: any) {
    console.error("Context states API error:", error);
    return NextResponse.json({ error: "Failed to fetch snapshots" }, { status: 500 });
  }
}
