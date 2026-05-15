import { db } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { checkRateLimit, setRateLimitHeaders } from "@/lib/rate-limit";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export async function POST(request: Request) {
  let rateLimitResult;
  try {
    // SECURITY: Implement rate limiting on signup to prevent enumeration/spam
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    rateLimitResult = await checkRateLimit(`signup:${ip}`);
    
    if (!rateLimitResult.success) {
      const response = NextResponse.json(
        { error: "Too Many Requests", message: "Account creation rate limit exceeded. Please try again later." },
        { status: 429 }
      );
      setRateLimitHeaders(response.headers, rateLimitResult);
      return response;
    }

    const body = await request.json();
    const { email, password, name } = signupSchema.parse(body);

    const usersColl = db.collection("users");
    const teamsColl = db.collection("teams");

    // 1. Check if user exists
    const existingUser = await usersColl.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    const userId = uuidv4();
    const teamId = uuidv4();

    // 3. Create User
    await usersColl.insertOne({
      _id: userId,
      email,
      passwordHash,
      name,
      createdAt: new Date(),
    });

    // 4. Create Team
    await teamsColl.insertOne({
      _id: teamId,
      name: `${name}'s Team`,
      slug: email.split("@")[0] + "-" + Math.random().toString(36).substring(2, 6),
      members: [
        {
          userId: userId,
          role: "ADMIN",
        }
      ],
      createdAt: new Date(),
    });

    // 5. Create Session
    await createSession(userId, teamId);

    const response = NextResponse.json({ success: true, user: { id: userId, name } });
    if (rateLimitResult) {
      setRateLimitHeaders(response.headers, rateLimitResult);
    }
    return response;
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
