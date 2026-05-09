import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.teamId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify key belongs to team in Astra DB
    const key = await db.collection("api_keys").findOne({
      _id: id,
      teamId: session.teamId,
    });

    if (!key) {
      return NextResponse.json({ error: "Key not found" }, { status: 404 });
    }

    await db.collection("api_keys").updateOne(
      { _id: id },
      { $set: { revokedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to revoke API key:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
