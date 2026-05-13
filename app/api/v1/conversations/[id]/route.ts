import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.teamId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = session.userId;

    const conversationsColl = db.collection("conversations");
    const messagesColl = db.collection("messages");
    const teamsColl = db.collection("teams");

    // 1. Resolve Authorized Teams for this User
    const allTeams = await teamsColl.find({}).toArray();
    const userTeamIds = allTeams
      .filter(team => team.members?.some((m: any) => m.userId === userId))
      .map(team => team._id);

    // 2. Fetch Conversation
    const conversation = await conversationsColl.findOne({
      _id: id,
      teamId: { $in: userTeamIds },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found or unauthorized" }, { status: 404 });
    }

    // 2. Fetch Messages
    const cursor = messagesColl.find(
      { conversationId: id }, 
      { sort: { order: 1, createdAt: 1 } }
    );
    const messages = await cursor.toArray();

    return NextResponse.json({
      conversation,
      messages,
    });
  } catch (error: any) {
    console.error("Failed to fetch conversation details:", error);
    return NextResponse.json({ error: "Failed to fetch conversation" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.teamId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = session.userId;
    const updates = await request.json();

    const conversationsColl = db.collection("conversations");
    const teamsColl = db.collection("teams");

    // Resolve Authorized Teams for this User
    const allTeams = await teamsColl.find({}).toArray();
    const userTeamIds = allTeams
      .filter(team => team.members?.some((m: any) => m.userId === userId))
      .map(team => team._id);

    // Verify conversation access
    const conversation = await conversationsColl.findOne({
      _id: id,
      teamId: { $in: userTeamIds },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found or unauthorized" }, { status: 404 });
    }

    // Prepare update payload
    const updatePayload: any = { updatedAt: new Date() };
    if (updates.title) updatePayload.title = updates.title;
    if (updates.description !== undefined) updatePayload.description = updates.description;

    // Handle Team Transfer
    if (updates.teamId && updates.teamId !== conversation.teamId) {
      if (!userTeamIds.includes(updates.teamId)) {
         return NextResponse.json({ error: "Unauthorized transfer target" }, { status: 403 });
      }
      updatePayload.teamId = updates.teamId;
    }

    await conversationsColl.updateOne(
      { _id: id },
      { $set: updatePayload }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update conversation:", error);
    return NextResponse.json({ error: "Failed to update conversation" }, { status: 500 });
  }
}

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
    const userId = session.userId;

    const conversationsColl = db.collection("conversations");
    const messagesColl = db.collection("messages");
    const teamsColl = db.collection("teams");

    // Resolve Authorized Teams for this User
    const allTeams = await teamsColl.find({}).toArray();
    const userTeamIds = allTeams
      .filter(team => team.members?.some((m: any) => m.userId === userId))
      .map(team => team._id);

    // Verify conversation access
    const conversation = await conversationsColl.findOne({
      _id: id,
      teamId: { $in: userTeamIds },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found or unauthorized" }, { status: 404 });
    }

    await conversationsColl.deleteOne({ _id: id });
    // Cleanup messages associated with this conversation
    await messagesColl.deleteMany({ conversationId: id });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete conversation:", error);
    return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 });
  }
}
