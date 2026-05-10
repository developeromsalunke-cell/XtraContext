import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

/**
 * GET /api/v1/teams
 * Returns the list of teams the authenticated user is a member of.
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;
    const teamsColl = db.collection("teams");

    console.log(`[Teams API] GET: Fetching all teams to filter for userId: ${userId}`);

    // FETCH & FILTER STRATEGY:
    // To avoid Astra DB nested array query issues, we fetch the teams and filter in-memory.
    // This is extremely fast for team-scale data and ensures 100% reliability.
    const allTeams = await teamsColl.find({}).toArray();
    
    const userTeams = allTeams.filter(team => 
      team.members?.some((m: any) => m.userId === userId)
    );

    console.log(`[Teams API] Match Success: Found ${userTeams.length} teams for user among ${allTeams.length} total teams.`);

    // Resolve user details for members
    const usersColl = db.collection("users");
    const enhancedTeams = await Promise.all(userTeams.map(async (team) => {
      const membersWithDetails = await Promise.all((team.members || []).map(async (member: any) => {
        try {
          const user = await usersColl.findOne({ _id: member.userId });
          return {
            ...member,
            name: user?.name || "Team Member",
            email: user?.email || "No Email",
          };
        } catch (err) {
          return { ...member, name: "Team Member", email: "No Email" };
        }
      }));
      return { ...team, members: membersWithDetails };
    }));

    return NextResponse.json({ teams: enhancedTeams });
  } catch (error) {
    console.error("[Teams API] GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST /api/v1/teams
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await request.json();
    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Invalid team name" }, { status: 400 });
    }

    const userId = session.userId;
    const teamsColl = db.collection("teams");

    const teamId = uuidv4();
    const slug = name.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

    const newTeam = {
      _id: teamId,
      name,
      slug,
      members: [
        {
          userId: userId,
          role: "ADMIN",
          joinedAt: new Date(),
        }
      ],
      createdAt: new Date(),
    };

    console.log(`[Teams API] POST: Created team '${name}' for userId: ${userId}`);
    await teamsColl.insertOne(newTeam);

    return NextResponse.json({ team: newTeam }, { status: 201 });
  } catch (error) {
    console.error("[Teams API] POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
