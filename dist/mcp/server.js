"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
require("dotenv/config");
// Configuration
const apiUrl = process.env.CONTEXTVAULT_API_URL;
const apiKey = process.env.CONTEXTVAULT_API_KEY;
if (!apiUrl || !apiKey) {
    console.error("Missing CONTEXTVAULT_API_URL or CONTEXTVAULT_API_KEY");
    console.error("Please generate an Access Token in the ContextVault Dashboard.");
    process.exit(1);
}
// Initialize MCP Server
const server = new index_js_1.Server({
    name: "contextvault-mcp",
    version: "2.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// Register Tools
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "search_memory",
                description: "Search ContextVault for past conversations and architectural decisions.",
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
                description: "Save an important decision or workflow step to ContextVault.",
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
        ],
    };
});
// Handle Tool Calls via Proxy
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
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
                    params: { query: args.query },
                }),
            });
            if (!response.ok)
                throw new Error(`Proxy error: ${response.statusText}`);
            const { results } = await response.json();
            const formatted = results.map((r) => `Title: ${r.title}\nDescription: ${r.description}\nUpdated: ${r.updatedAt}`).join("\n\n---\n\n");
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
                            title: args.title,
                            description: args.content,
                        }
                    },
                }),
            });
            if (!response.ok)
                throw new Error(`Proxy error: ${response.statusText}`);
            return {
                content: [{ type: "text", text: `Successfully saved memory to ContextVault.` }],
            };
        }
        throw new Error("Unknown tool");
    }
    catch (error) {
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true,
        };
    }
});
// Start the Server
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("ContextVault Secure MCP Proxy running on stdio");
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
