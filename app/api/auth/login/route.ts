import { db } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // 0. Rate limiting (prevent brute force)
    const rateLimit = await checkRateLimit(`login:${email}`, { maxRequests: 5, windowMs: 60000 });
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many login attempts. Please try again in a minute." }, { status: 429 });
    }

    const usersColl = db.collection("users");
    const teamsColl = db.collection("teams");

    // 1. Find user
    const user = await usersColl.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 2. Find the user's team (searching in teams where user is a member)
    const team = await teamsColl.findOne({
      "members.userId": user._id
    });

    if (!team) {
      return NextResponse.json({ error: "User has no team assigned" }, { status: 400 });
    }

    // 3. Create Session
    await createSession(user._id as string, team._id as string);

    return NextResponse.json({ success: true, user: { id: user._id, name: user.name } });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
