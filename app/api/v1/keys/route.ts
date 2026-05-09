import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { createApiKey } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const createKeySchema = z.object({
  label: z.string().min(1).max(50),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.teamId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const keys = await db.collection("api_keys").find({
      teamId: session.teamId,
      revokedAt: null 
    }).sort({ createdAt: -1 }).toArray();

    // Map to expected format
    const formattedKeys = keys.map(k => ({
      id: k._id,
      prefix: k.prefix,
      label: k.label,
      lastUsedAt: k.lastUsedAt,
      createdAt: k.createdAt,
    }));

    return NextResponse.json({ keys: formattedKeys });
  } catch (error) {
    console.error("Failed to fetch API keys:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.teamId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { label } = createKeySchema.parse(body);

    const rawKey = await createApiKey(session.teamId, label);

    return NextResponse.json({ key: rawKey }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("Failed to create API key:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
