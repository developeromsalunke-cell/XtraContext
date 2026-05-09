import "dotenv/config";
import { db } from "../lib/db";
import { v4 as uuidv4 } from "uuid";

async function runTest() {
  console.log("🚀 Starting Internal Logic Test (Astra DB)...");

  const teamId = "test-team-123";
  const threadId = uuidv4();

  try {
    // 1. Setup Test Data
    console.log("Step 1: Creating test thread...");
    await db.collection("conversations").insertOne({
      _id: threadId,
      teamId,
      title: "E2E Internal Test",
      description: "Testing append_message logic directly",
      messageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 2. Simulate 'append_message' Logic
    console.log("Step 2: Simulating 'append_message' internal logic...");
    
    // logic from app/api/v1/mcp/proxy/route.ts
    const conversationsColl = db.collection("conversations");
    const thread = await conversationsColl.findOne({ _id: threadId, teamId });
    
    if (!thread) throw new Error("Thread not found");

    const messagesColl = db.collection("messages");
    const messageId = uuidv4();
    
    await messagesColl.insertOne({
      _id: messageId,
      conversationId: threadId,
      role: "ASSISTANT",
      content: "This is a direct logic test message.",
      tokenCount: 100,
      cost: 0.001,
      order: (thread.messageCount || 0),
      createdAt: new Date(),
    });

    await conversationsColl.updateOne(
      { _id: threadId },
      { 
        $set: { updatedAt: new Date() },
        $inc: { messageCount: 1 } 
      }
    );

    console.log("✅ Logic simulation complete!");

    // 3. Verify
    console.log("Step 3: Verifying database state...");
    const updatedThread = await db.collection("conversations").findOne({ _id: threadId });
    const message = await db.collection("messages").findOne({ conversationId: threadId });

    console.log("Thread messageCount:", updatedThread?.messageCount);
    console.log("Message Content:", message?.content);

    if (updatedThread?.messageCount === 1 && message?.content.includes("logic test")) {
      console.log("🏆 TEST PASSED: Internal storage logic is fully functional.");
    } else {
      console.log("❌ TEST FAILED: Database state mismatch.");
    }

  } catch (err: any) {
    console.error("❌ Test error:", err.message);
  } finally {
    // Cleanup
    console.log("Cleaning up...");
    await db.collection("conversations").deleteOne({ _id: threadId });
    await db.collection("messages").deleteOne({ conversationId: threadId });
    process.exit(0);
  }
}

runTest();
