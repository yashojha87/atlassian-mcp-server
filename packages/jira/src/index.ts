import { connectServer, createMcpServer, formatToolResponse } from '@atlassian-mcp-server/common';
import { JiraService, jiraToolSchemas } from './jira-service.js';
import * as process from 'node:process';

// Validate required environment variables
const missingEnvVars = JiraService.validateConfig();
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const jiraService = new JiraService(
  process.env.JIRA_HOST!,
  process.env.JIRA_API_TOKEN!,
  process.env.JIRA_API_BASE_PATH,
);

// Initialize MCP server
const server = createMcpServer({
  name: "atlassian-jira-mcp",
  version: "0.1.0"
});

// Define JIRA instance type
const jiraInstanceType = "JIRA Data Center edition instance";

// Add JIRA issue search tool
server.tool(
  "jira_searchIssues",
  `Search for JIRA issues using JQL in the ${jiraInstanceType}`,
  jiraToolSchemas.searchIssues,
  async ({ jql, expand, startAt, maxResults = 10 }) => {
    const result = await jiraService.searchIssues(jql, startAt, expand, maxResults);
    return formatToolResponse(result);
  }
);

// Add get JIRA issue tool
server.tool(
  "jira_getIssue",
  `Get details of a JIRA issue by its key from the ${jiraInstanceType}`,
  jiraToolSchemas.getIssue,
  async ({ issueKey, expand }) => {
    const result = await jiraService.getIssue(issueKey, expand);
    return formatToolResponse(result);
  }
);

server.tool(
  'jira_getIssueComments',
  `Get comments of a JIRA issue by its key from the ${jiraInstanceType}`,
  jiraToolSchemas.getIssueComments,
  async ({ issueKey, expand }) => {
    const result = await jiraService.getIssueComments(issueKey, expand);
    return formatToolResponse(result);
  });

// Add create JIRA issue tool
server.tool(
  "jira_createIssue",
  `Create a new JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.createIssue,
  async (params) => {
    const result = await jiraService.createIssue(params);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_postIssueComment",
  `Post a comment on a JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.postIssueComment,
  async ({ issueKey, comment }) => {
    const result = await jiraService.postIssueComment(issueKey, comment);
    return formatToolResponse(result);
  }
);

// Add update JIRA issue tool
server.tool(
  "jira_updateIssue",
  `Update an existing JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.updateIssue,
  async (params) => {
    const result = await jiraService.updateIssue(params.issueKey, params);
    return formatToolResponse(result);
  }
);

// Connect the server after all tools are registered
await connectServer(server);
