import { createMcpServer, formatToolResponse } from '@atlassian-dc-mcp/common';
import { ConfluenceService, confluenceToolSchemas } from './confluence-service.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// This is just a placeholder - uncomment when you're ready to implement Confluence
/*
// Validate required environment variables
const missingEnvVars = ConfluenceService.validateConfig();
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Initialize Confluence service
const confluenceService = new ConfluenceService(
  process.env.CONFLUENCE_HOST!,
  process.env.CONFLUENCE_API_TOKEN!
);

// Initialize MCP server
const server = await createMcpServer({
  name: "atlassian-confluence-mcp",
  version: "0.1.0"
});

// Add Confluence page tool
server.tool(
  "confluence_getPage",
  "Get a Confluence page by ID",
  confluenceToolSchemas.getPage,
  async ({ pageId }) => {
    const result = await confluenceService.getPage(pageId);
    return formatToolResponse(result);
  }
);
*/

// For now, just create a simple server
const server = await createMcpServer({
  name: "atlassian-confluence-mcp",
  version: "0.1.0"
});

console.log("Confluence MCP server started (placeholder)");
