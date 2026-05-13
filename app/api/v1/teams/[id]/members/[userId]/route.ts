import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: teamId, userId: targetUserId } = await params;
    const { role } = await request.json();

    if (!role || !["ADMIN", "MEMBER", "VIEWER"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // 1. Verify the current user is an ADMIN of the team
    const team = await db.collection("teams").findOne({ _id: teamId });
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const currentUserMember = team.members?.find((m: any) => m.userId === session.userId);
    if (!currentUserMember || currentUserMember.role !== "ADMIN") {
      return NextResponse.json({ error: "Only team admins can update roles" }, { status: 403 });
    }

    // 2. Update the role in the members array
    const updatedMembers = team.members.map((m: any) => {
      if (m.userId === targetUserId) {
        return { ...m, role };
      }
      return m;
    });

    await db.collection("teams").updateOne(
      { _id: teamId },
      { $set: { members: updatedMembers, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update role error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
