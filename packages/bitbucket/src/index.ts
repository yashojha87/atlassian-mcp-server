import { createMcpServer } from '@atlassian-dc-mcp/common';

// Initialize MCP server
const server = await createMcpServer({
  name: "atlassian-bitbucket-mcp",
  version: "0.1.0"
});

console.log("Bitbucket MCP server started (placeholder)");
