import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import express from "express";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Initialize MCP server
const server = new McpServer({
  name: "atlassian-mcp",
  version: "1.0.0"
});

// Add a simple test tool
server.tool(
  "hello",
  "Say hello to verify server is working",
  {
    name: z.string().describe("Name to greet")
  },
  async ({ name }) => {
    return {
      content: [
        {
          type: "text",
          text: `Hello ${name}! Atlassian MCP server is running.`
        }
      ]
    };
  }
);

// Error handler helper
const handleError = (error: Error) => {
  console.error("Server error:", error);
  process.exit(1);
};


const transport = new StdioServerTransport();
await server.connect(transport);

// I was not able to run below for claude desktop
//
// const app = express();
// let transport: SSEServerTransport | null = null;
//
// app.get("/sse", (req, res) => {
//   transport = new SSEServerTransport("/messages", res);
//   server.connect(transport);
// });
//
// // Message endpoint
// app.post("/messages", (req, res) => {
//   if (transport) {
//     transport.handlePostMessage(req, res);
//   }
// });
//
// // Start server
// const PORT = process.env.PORT || '3099';
// app.listen(parseInt(PORT), () => {
//   console.error(`Atlassian MCP Server running on http://localhost:${PORT}`);
// });
