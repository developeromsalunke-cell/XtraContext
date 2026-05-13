import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { askGroq } from "@/lib/groq";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question } = await request.json();
    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const userId = session.userId;
    const teamsColl = db.collection("teams");
    const conversationsColl = db.collection("conversations");
    const messagesColl = db.collection("messages");

    const allTeams = await teamsColl.find({}).toArray();
    const userTeamIds = allTeams
      .filter(team => team.members?.some((m: any) => m.userId === userId))
      .map(team => team._id);

    if (userTeamIds.length === 0) {
      return NextResponse.json({ answer: "You don't have access to any teams yet.", sources: [] });
    }

    // Step 1: Fetch recent threads
    const recentThreads = await conversationsColl.find(
      { teamId: { $in: userTeamIds } },
      { sort: { updatedAt: -1 }, limit: 50 }
    ).toArray();

    if (recentThreads.length === 0) {
      return NextResponse.json({ answer: "No knowledge threads found in your vault.", sources: [] });
    }

    const threadContextList = recentThreads.map(t => `ID: ${t._id} | Title: ${t.title} | Desc: ${t.description}`).join('\n');

    // Step 2: Ask Groq to identify relevant threads
    const identificationPrompt = `
You are a retrieval assistant. Given the following list of conversation threads:
${threadContextList}

Which of these threads are most likely to contain the answer to the user's question: "${question}"?
Return ONLY a JSON array of the thread IDs (strings) that are relevant, up to a maximum of 3 IDs. Example: ["id1", "id2"]. If none are relevant, return [].
Do not include any other text.
`;

    const identifiedStr = await askGroq(identificationPrompt);
    let topThreadIds: string[] = [];
    try {
      // Find JSON array in the response string
      const match = identifiedStr.match(/\[[\s\S]*\]/);
      if (match) {
        topThreadIds = JSON.parse(match[0]);
      } else {
         topThreadIds = JSON.parse(identifiedStr);
      }
    } catch (e) {
      console.error("Failed to parse Groq thread IDs response:", identifiedStr);
    }

    if (!Array.isArray(topThreadIds) || topThreadIds.length === 0) {
      return NextResponse.json({ 
        answer: "I couldn't find any relevant context in your recent threads to answer this question. Try rephrasing or asking something else.",
        sources: [] 
      });
    }

    // Step 3: Fetch messages for top threads
    const messages = await messagesColl.find({ conversationId: { $in: topThreadIds } }).toArray();
    
    // Group messages by conversation
    const threadData = topThreadIds.map(id => {
      const thread = recentThreads.find(t => t._id === id);
      const threadMessages = messages.filter(m => m.conversationId === id).sort((a, b) => a.order - b.order);
      return {
        id,
        title: thread?.title,
        messages: threadMessages.map(m => `${m.role}: ${m.content}`).join('\n')
      };
    });

    const synthesisPrompt = `
You are XtraContext AI, an intelligent coding and architectural assistant.
Answer the following question: "${question}"

Base your answer strictly on the following context from the user's memory vault:
${JSON.stringify(threadData, null, 2)}

Provide a clear, helpful, and concise answer in Markdown format. If the context doesn't fully answer the question, state what is known and what is missing.
`;

    const answer = await askGroq(synthesisPrompt);
    
    const sources = recentThreads.filter(t => topThreadIds.includes(t._id as string));

    // Optional: Log query to AI queries collection
    try {
      const aiQueriesColl = db.collection("ai_queries");
      await aiQueriesColl.insertOne({
        _id: uuidv4(),
        teamId: session.teamId || userTeamIds[0],
        question,
        answer,
        sourceThreadIds: topThreadIds,
        createdAt: new Date()
      });
    } catch (e) {
      console.error("Failed to log AI query", e);
    }

    return NextResponse.json({ answer, sources });

  } catch (error: any) {
    console.error("AI Query API error:", error);
    return NextResponse.json({ error: "Failed to process query" }, { status: 500 });
  }
}
