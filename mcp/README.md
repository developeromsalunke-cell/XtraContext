# 🌌 XtraContext MCP Server

Connect your local AI agents (Claude, Cursor, Windsurf) to **XtraContext**—the universal memory layer for architectural AI engineering.

## 🚀 Quick Start

Sync your project context and architectural decisions across any platform.

### 1. Installation

You can run the server directly using `npx`:

```bash
npx @xtracontext/mcp
```

### 2. Configuration

To connect, you'll need an **Access Token** from your XtraContext Dashboard.

1.  Go to `https://xtracontext.app/dashboard/settings/keys`
2.  Generate a new token (e.g., "My Local Agent")
3.  Add the following environment variables to your agent's config:

| Variable | Description |
| :--- | :--- |
| `XTRACONTEXT_API_URL` | `https://xtracontext.app/api/v1/mcp/proxy` |
| `XTRACONTEXT_API_KEY` | Your generated `xc_...` token |

### 🛠️ Agent Setup

#### Claude Desktop
Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "xtracontext": {
      "command": "npx",
      "args": ["@xtracontext/mcp"],
      "env": {
        "XTRACONTEXT_API_URL": "https://xtracontext.vercel.app/api/v1/mcp/proxy",
        "XTRACONTEXT_API_KEY": "xc_your_token_here"
      }
    }
  }
}
```

#### Cursor / Windsurf
Add a new MCP server in settings:
- **Type**: `command`
- **Command**: `npx @xtracontext/mcp`
- **Environment Variables**: Add `XTRACONTEXT_API_URL` and `XTRACONTEXT_API_KEY`.

## 🧠 Capabilities

- **`search_memory`**: Search your architectural history for past decisions, patterns, and code snippets.
- **`log_action`**: Proactively save important project context or engineering decisions to your universal vault.
- **`append_memory`**: Add new messages or turns to an existing context thread.

---
Built with 🖤 by [XtraContext](https://xtracontext.vercel.app)
