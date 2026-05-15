
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { validateCsrf } from "@/lib/auth";

/**
 * PATCH /api/v1/teams/invitations/[id]
 * Accept an invitation.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // SECURITY: Validate CSRF for session-based mutation
    validateCsrf(request);

    const { action } = await request.json();
    if (action !== "accept") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const invitationsColl = db.collection("team_invitations");
    const invitation = await invitationsColl.findOne({ _id: id });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (invitation.inviteeEmail !== session.userEmail) {
      return NextResponse.json({ error: "This invitation was sent to a different email" }, { status: 403 });
    }

    if (invitation.status !== "PENDING") {
      return NextResponse.json({ error: "Invitation is no longer pending" }, { status: 400 });
    }

    // 1. Add user to team members
    const teamsColl = db.collection("teams");
    const team = await teamsColl.findOne({ _id: invitation.teamId });
    if (!team) {
      return NextResponse.json({ error: "Team no longer exists" }, { status: 404 });
    }

    // Check if already a member
    const isMember = team.members?.some((m: any) => m.userId === session.userId);
    if (!isMember) {
      await teamsColl.updateOne(
        { _id: invitation.teamId },
        { 
          $push: { 
            members: { 
              userId: session.userId, 
              role: invitation.role || "DEVELOPER", 
              joinedAt: new Date() 
            } 
          } 
        }
      );
    }

    // 2. Mark invitation as ACCEPTED
    await invitationsColl.updateOne(
      { _id: id },
      { $set: { status: "ACCEPTED", updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Invitations API] PATCH Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * DELETE /api/v1/teams/invitations/[id]
 * Reject or cancel an invitation.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // SECURITY: Validate CSRF for session-based mutation
    validateCsrf(request);

    const invitationsColl = db.collection("team_invitations");
    const invitation = await invitationsColl.findOne({ _id: id });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    // Only inviter or invitee can delete/reject
    if (invitation.inviteeEmail !== session.userEmail && invitation.inviterId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await invitationsColl.deleteOne({ _id: id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Invitations API] DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
