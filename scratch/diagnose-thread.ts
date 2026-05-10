import { db } from "../lib/db";

async function diagnoseThread() {
  const threadId = "86ab09bc-891c-46c6-b34c-343a50334ba6";
  console.log(`\n--- Diagnosing Thread: ${threadId} ---`);

  const thread = await db.collection("conversations").findOne({ _id: threadId });
  
  if (!thread) {
    console.log("❌ Thread NOT FOUND in 'conversations' collection.");
    return;
  }

  console.log("✅ Thread FOUND.");
  console.log(`   Title: ${thread.title}`);
  console.log(`   Team ID: ${thread.teamId}`);

  // Check team membership
  const team = await db.collection("teams").findOne({ _id: thread.teamId });
  if (!team) {
    console.log("❌ Team associated with thread NOT FOUND.");
  } else {
    console.log(`✅ Team Found: ${team.name}`);
    console.log(`   Members:`, team.members?.map((m: any) => m.userId).join(", "));
  }

  // Check all teams for the user in session (if we knew it)
  // Let's list all teams to see if there's any ID mismatch
  const allTeams = await db.collection("teams").find({}).toArray();
  console.log(`\n--- System Check ---`);
  console.log(`Total Teams in DB: ${allTeams.length}`);
}

diagnoseThread().catch(console.error);
