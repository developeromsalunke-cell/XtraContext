import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.collection("users").findOne({ _id: session.userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name || "Aiden Dev",
      email: user.email || "aiden@xtracontext.app",
      role: user.profile?.role || "Lead Architect",
      team: user.profile?.team || "Core Infrastructure",
      joined: user.createdAt 
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
        : "May 2026",
      activeThreads: user.profile?.activeThreads || 14,
      totalLogs: user.profile?.totalLogs || 1240,
    });
  } catch (error) {
    console.error("GET profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

const profileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  role: z.string().max(50).optional(),
  team: z.string().max(50).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = profileSchema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid profile data" }, { status: 400 });
    }

    const { name, email, role, team } = parseResult.data;
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData["profile.role"] = role;
    if (team) updateData["profile.team"] = team;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    await db.collection("users").updateOne(
      { _id: session.userId },
      { $set: updateData }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
