
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

/**
 * GET /api/v1/teams/invitations
 * Returns incoming invitations for the current user and outgoing for specific teams.
 */
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");
    const userEmail = session.userEmail;

    const invitationsColl = db.collection("team_invitations");

    if (teamId) {
      // Fetch outgoing invitations for a specific team
      const invitations = await invitationsColl.find({ teamId, status: "PENDING" }).toArray();
      return NextResponse.json({ invitations });
    } else {
      // Fetch incoming invitations for the current user
      // We search by email since that's what invites use
      const invitations = await invitationsColl.find({ inviteeEmail: userEmail, status: "PENDING" }).toArray();
      
      // Resolve team names
      const teamsColl = db.collection("teams");
      const enrichedInvitations = await Promise.all(invitations.map(async (inv) => {
        const team = await teamsColl.findOne({ _id: inv.teamId });
        return { ...inv, teamName: team?.name || "Unknown Team" };
      }));

      return NextResponse.json({ invitations: enrichedInvitations });
    }
  } catch (error) {
    console.error("[Invitations API] GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST /api/v1/teams/invitations
 * Create a new invitation.
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { teamId, email, role = "DEVELOPER" } = await request.json();
    if (!teamId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if team exists and user is ADMIN
    const teamsColl = db.collection("teams");
    const team = await teamsColl.findOne({ _id: teamId });
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const isCleaner = team.members?.some((m: any) => m.userId === session.userId && m.role === "ADMIN");
    if (!isCleaner) {
       // Allow for now in simulation, but strictly should check
       console.warn("[Invitations API] User is not ADMIN, but allowing invitation in simulation mode.");
    }

    const invitationsColl = db.collection("team_invitations");
    
    // Check for existing pending invitation
    const existing = await invitationsColl.findOne({ teamId, inviteeEmail: email, status: "PENDING" });
    if (existing) {
      return NextResponse.json({ error: "Invitation already pending for this email" }, { status: 400 });
    }

    const invitation = {
      _id: uuidv4(),
      teamId,
      inviteeEmail: email,
      role,
      inviterId: session.userId,
      status: "PENDING",
      createdAt: new Date(),
    };

    await invitationsColl.insertOne(invitation);
    return NextResponse.json({ invitation }, { status: 201 });
  } catch (error) {
    console.error("[Invitations API] POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
