import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import "dotenv/config";

// Configuration
const apiUrl = process.env.XTRACONTEXT_API_URL;
const apiKey = process.env.XTRACONTEXT_API_KEY;

if (!apiUrl || !apiKey) {
  console.error("Missing XTRACONTEXT_API_URL or XTRACONTEXT_API_KEY");
  console.error("Please generate an Access Token in the XtraContext Dashboard.");
  process.exit(1);
}

// Initialize MCP Server
const server = new Server(
  {
    name: "xtracontext-mcp",
    version: "2.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_threads",
        description: "List recent architectural threads in your XtraContext team to find specific thread IDs.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "search_memory",
        description: "Search XtraContext for past conversations and architectural decisions.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "The topic or keyword to search for (optional if filtering by platform/model)" },
            platform: { type: "string", description: "Optional. Filter by platform (e.g. CHATGPT, API)" },
            model: { type: "string", description: "Optional. Filter by model (e.g. GPT_4, CLAUDE_3_OPUS)" },
          },
          required: ["query"],
        },
      },
      {
        name: "get_project_summary",
        description: "Retrieve a chronological history of decisions and messages for a specific thread.",
        inputSchema: {
          type: "object",
          properties: {
            threadId: { type: "string", description: "The ID of the thread to summarize" },
          },
          required: ["threadId"],
        },
      },
      {
        name: "log_action",
        description: "Save an important decision or workflow step to XtraContext.",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string", description: "Short title for the memory" },
            content: { type: "string", description: "Full details of the memory" },
            model: { type: "string", description: "The AI model used (e.g. GPT_4, CLAUDE_3_OPUS)" },
            platform: { type: "string", description: "The platform used (e.g. CHATGPT, API)" },
            totalTokens: { type: "number", description: "Total tokens consumed" },
            totalCost: { type: "number", description: "Total cost of the interaction" },
            tags: { type: "array", items: { type: "string" }, description: "Optional tags to categorize this memory" },
            importance: { type: "string", enum: ["critical", "standard", "deprecated"], description: "Priority level of this memory" },
          },
          required: ["title", "content"],
        },
      },
      {
        name: "append_memory",
        description: "Add a new message or turn to an existing XtraContext thread.",
        inputSchema: {
          type: "object",
          properties: {
            threadId: { type: "string", description: "The ID of the thread to append to" },
            role: { type: "string", enum: ["USER", "ASSISTANT", "SYSTEM"], description: "The role of the message author" },
            content: { type: "string", description: "The text content to append" },
            tokenCount: { type: "number", description: "Tokens consumed by this message" },
            cost: { type: "number", description: "Cost of this message" },
            platform: { type: "string", description: "The platform used (e.g. CHATGPT, API)" },
            model: { type: "string", description: "The AI model used (e.g. GPT_4, CLAUDE_3_OPUS)" },
          },
          required: ["threadId", "role", "content"],
        },
      },
      {
        name: "add_todo",
        description: "Add a persistent task or 'next step' to the project memory vault.",
        inputSchema: {
          type: "object",
          properties: {
            task: { type: "string", description: "The description of the task" },
            projectId: { type: "string", description: "Optional project/thread ID association" },
          },
          required: ["task"],
        },
      },
      {
        name: "list_todos",
        description: "View all active and completed tasks for the current team.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "complete_todo",
        description: "Mark a specific task as completed in the memory vault.",
        inputSchema: {
          type: "object",
          properties: {
            todoId: { type: "string", description: "The ID of the todo to complete" },
          },
          required: ["todoId"],
        },
      },
      {
        name: "init",
        description: "Initialize the XtraContext session and get guidelines on what to store in the memory vault.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "ask_vault",
        description: "Ask a natural language question about the project's architectural memory.",
        inputSchema: {
          type: "object",
          properties: {
            question: { type: "string", description: "The question to ask the memory vault" },
          },
          required: ["question"],
        },
      },
      {
        name: "save_snapshot",
        description: "Save a time-travel snapshot of the current workspace state to the memory vault.",
        inputSchema: {
          type: "object",
          properties: {
            content: { type: "string", description: "A summary or payload of the current workspace state/files." },
          },
          required: ["content"],
        },
      },
      {
        name: "validate_memory",
        description: "Validate a code snippet or architectural pattern against the existing memory vault.",
        inputSchema: {
          type: "object",
          properties: {
            codeSnippet: { type: "string", description: "The code or pattern to validate." },
          },
          required: ["codeSnippet"],
        },
      },
      {
        name: "synthesize_vault",
        description: "Generate a high-level architectural synthesis across all threads in the vault.",
        inputSchema: {
          type: "object",
          properties: {
            focus: { type: "string", description: "Optional focus area (e.g. 'security', 'performance')." },
          },
        },
      },
    ],
  };
});

// Handle Tool Calls via Proxy
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "search_memory") {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "search",
          params: { 
            query: (args as any).query,
            platform: (args as any).platform,
            model: (args as any).model
          },
        }),
      });

      if (!response.ok) throw new Error(`Proxy error: ${response.statusText}`);
      
      const { results } = await response.json();
      const formatted = Array.isArray(results)
        ? results.map((r: any) => 
            `Title: ${r.title}\nDescription: ${r.description}\nUpdated: ${r.updatedAt}`
          ).join("\n\n---\n\n")
        : "No relevant memories found.";

      return {
        content: [{ type: "text", text: formatted }],
      };

    }

    if (name === "log_action") {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "log",
          params: {
            conversation: {
              title: (args as any).title,
              description: (args as any).content,
              model: (args as any).model || process.env.ACTIVE_MODEL || "OTHER",
              platform: (args as any).platform || process.env.ACTIVE_PLATFORM || "API",
              totalTokens: (args as any).totalTokens || 0,
              totalCost: (args as any).totalCost || 0,
              tags: (args as any).tags || [],
              importance: (args as any).importance || "standard",
            }
          },
        }),
      });

      if (!response.ok) throw new Error(`Proxy error: ${response.statusText}`);

      return {
        content: [{ type: "text", text: `Successfully saved memory to XtraContext.` }],
      };
    }

    if (name === "list_threads") {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list_threads", params: {} }),
      });
      const data = await response.json();
      const threads = data.threads;
      const text = Array.isArray(threads) 
        ? threads.map((t: any) => `[${t._id}] ${t.title} (${t.messageCount || 0} msgs)`).join("\n")
        : "No threads found or invalid response.";
      return { content: [{ type: "text", text }] };
    }

    if (name === "get_project_summary") {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_messages", params: { threadId: (args as any).threadId } }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      const messages = data.messages;
      const text = Array.isArray(messages)
        ? messages.map((m: any) => `${m.role.toUpperCase()} [${m.platform || 'N/A'}] [${m.model || 'N/A'}]: ${m.content}`).join("\n\n---\n\n")
        : "This thread is empty or invalid.";
      return { content: [{ type: "text", text }] };
    }

    if (name === "add_todo") {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_todo", params: args }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || `Proxy error: ${response.statusText}`);
      }
      return { content: [{ type: "text", text: "Task successfully added to the project memory vault." }] };
    }

    if (name === "ask_vault") {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ask_vault", params: { question: (args as any).question } }),
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || `Proxy error: ${response.statusText}`);
      return { content: [{ type: "text", text: data.answer }] };
    }
    if (name === "list_todos") {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list_todos", params: {} }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      const todos = data.todos;
      const text = Array.isArray(todos)
        ? todos.map((t: any) => `${t.completed ? "[x]" : "[ ]"} ${t.task} (ID: ${t._id})`).join("\n")
        : "No tasks found or invalid format.";
      return { content: [{ type: "text", text }] };
    }



    if (name === "complete_todo") {
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete_todo", params: { todoId: (args as any).todoId } }),
      });
      return { content: [{ type: "text", text: "Task marked as completed." }] };
    }

    if (name === "append_memory") {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "append_message",
          params: {
            threadId: (args as any).threadId,
            message: {
              role: (args as any).role,
              content: (args as any).content,
              tokenCount: (args as any).tokenCount || 0,
              cost: (args as any).cost || 0,
              platform: (args as any).platform || process.env.ACTIVE_PLATFORM || "API",
              model: (args as any).model || process.env.ACTIVE_MODEL || "OTHER",
            }
          },
        }),
      });

      if (!response.ok) throw new Error(`Proxy error: ${response.statusText}`);

      return {
        content: [{ type: "text", text: `Successfully appended message to thread: ${(args as any).threadId}` }],
      };
    }

    if (name === "save_snapshot") {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_snapshot", params: { content: (args as any).content } }),
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || `Proxy error: ${response.statusText}`);
      return { content: [{ type: "text", text: `Snapshot saved successfully. Version: ${data.version}` }] };
    }

    if (name === "validate_memory") {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "validate", params: { codeSnippet: (args as any).codeSnippet } }),
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || `Proxy error: ${response.statusText}`);
      return { content: [{ type: "text", text: data.feedback }] };
    }

    if (name === "synthesize_vault") {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "synthesize", params: { focus: (args as any).focus } }),
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || `Proxy error: ${response.statusText}`);
      return { content: [{ type: "text", text: data.synthesis }] };
    }
    
    if (name === "init") {
      return {
        content: [{
          type: "text",
          text: `
# XtraContext AI Guidelines
Welcome! You are connected to the XtraContext Memory Vault. To ensure high-quality architectural memory, follow these storage rules:

### 1. What to Store (Critical)
- **Architectural Decisions**: Why we chose a specific library, database, or pattern.
- **Schema & Data Models**: Any changes to the database structure or API contracts.
- **Complex Logic**: Obscure bugs we fixed or complex algorithms that are hard to re-explain.
- **Project Progress**: Major milestones and "Done" states.
- **Stateful Context**: Things that typically get lost when a chat session resets (e.g., 'we decided to use UUIDs instead of ObjectIDs').

### 2. What to Avoid
- **Trivial Chat**: Don't log "Hello" or "Thank you".
- **Repetitive Debugging**: Only log the *solution* and *lesson learned*, not every failed attempt.
- **Sensitive Data**: NEVER log API keys, passwords, or PII.

### 3. Usage Patterns
- Use **log_action** for creating a new "Context Thread" for a new topic.
- Use **append_memory** to add updates to an existing thread.
- Use **add_todo** for actionable next steps.

By following these rules, you help maintain a clean, searchable, and professional knowledge graph for the human developer.
          `.trim()
        }]
      };
    }

    throw new Error("Unknown tool");
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// Start the Server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("XtraContext Secure MCP Proxy running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
