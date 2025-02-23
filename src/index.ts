import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import dotenv from 'dotenv';
import { JiraService, jiraToolSchemas } from './jira-service.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const missingEnvVars = JiraService.validateConfig();
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Initialize JIRA service
const jiraService = new JiraService(
  process.env.JIRA_HOST!,
  process.env.JIRA_API_TOKEN!
);

// Helper function to format tool responses
const formatToolResponse = (result: unknown) => ({
  content: [{
    type: 'text' as const,
    text: JSON.stringify(result, null, 2)
  }]
});

// Initialize MCP server
const server = new McpServer({
  name: "atlassian-mcp",
  version: "0.1.0"
});

// Add JIRA issue search tool
server.tool(
  "jira_searchIssues",
  "Search for JIRA issues using JQL",
  jiraToolSchemas.searchIssues,
  async ({ jql, maxResults = 10 }) => {
    const result = await jiraService.searchIssues(jql, maxResults);
    return formatToolResponse(result);
  }
);

// Add get JIRA issue tool
server.tool(
  "jira_getIssue",
  "Get details of a JIRA issue by its key",
  jiraToolSchemas.getIssue,
  async ({ issueKey }) => {
    const result = await jiraService.getIssue(issueKey);
    return formatToolResponse(result);
  }
);

// Add create JIRA issue tool
server.tool(
  "jira_createIssue",
  "Create a new JIRA issue",
  jiraToolSchemas.createIssue,
  async (params) => {
    const result = await jiraService.createIssue(params);
    return formatToolResponse(result);
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
