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
        name: "search_memory",
        description: "Search XtraContext for past conversations and architectural decisions.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The topic or keyword to search for",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "log_action",
        description: "Save an important decision or workflow step to XtraContext.",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Short title for the memory",
            },
            content: {
              type: "string",
              description: "Full details of the memory",
            },
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
            threadId: {
              type: "string",
              description: "The ID of the thread to append to",
            },
            role: {
              type: "string",
              enum: ["USER", "ASSISTANT", "SYSTEM"],
              description: "The role of the message author",
            },
            content: {
              type: "string",
              description: "The text content to append",
            },
          },
          required: ["threadId", "role", "content"],
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
