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
            query: { type: "string", description: "The topic or keyword to search for" },
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
          params: { query: (args as any).query },
        }),
      });

      if (!response.ok) throw new Error(`Proxy error: ${response.statusText}`);
      
      const { results } = await response.json();
      const formatted = results.map((r: any) => 
        `Title: ${r.title}\nDescription: ${r.description}\nUpdated: ${r.updatedAt}`
      ).join("\n\n---\n\n");

      return {
        content: [{ type: "text", text: formatted || "No relevant memories found." }],
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
      const { threads } = await response.json();
      const text = threads.map((t: any) => `[${t._id}] ${t.title} (${t.messageCount || 0} msgs)`).join("\n");
      return { content: [{ type: "text", text: text || "No threads found." }] };
    }

    if (name === "get_project_summary") {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_messages", params: { threadId: (args as any).threadId } }),
      });
      const { messages } = await response.json();
      const text = messages.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n---\n\n");
      return { content: [{ type: "text", text: text || "This thread is empty." }] };
    }

    if (name === "add_todo") {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_todo", params: args }),
      });
      return { content: [{ type: "text", text: "Task added to project vault." }] };
    }

    if (name === "list_todos") {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list_todos", params: {} }),
      });
      const { todos } = await response.json();
      const text = todos.map((t: any) => `${t.completed ? "[x]" : "[ ]"} ${t.task} (ID: ${t._id})`).join("\n");
      return { content: [{ type: "text", text: text || "No tasks found." }] };
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
            }
          },
        }),
      });

      if (!response.ok) throw new Error(`Proxy error: ${response.statusText}`);

      return {
        content: [{ type: "text", text: `Successfully appended message to thread: ${(args as any).threadId}` }],
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
