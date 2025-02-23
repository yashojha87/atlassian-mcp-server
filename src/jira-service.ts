import JiraClient from 'jira-client';
import { z } from 'zod';

// Type definitions for JIRA responses
interface JiraIssueResponse {
  key: string;
  fields: {
    summary: string;
    description: string;
    status: { name: string };
    created: string;
    updated: string;
    assignee?: { displayName: string };
  };
}

interface JiraError {
  message: string;
  statusCode?: number;
}

export class JiraService {
  private client: JiraClient;

  constructor(host: string, token: string) {
    this.client = new JiraClient({
      protocol: 'https',
      host: host,
      bearer: token,
      apiVersion: '2',
      strictSSL: true
    });
  }

  private formatError(error: unknown): string {
    if (error instanceof Error) {
      return `JIRA API Error: ${error.message}`;
    }
    return 'Unknown JIRA API error occurred';
  }

  private formatIssueResponse(issue: JiraIssueResponse) {
    return {
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      description: issue.fields.description,
      created: issue.fields.created,
      updated: issue.fields.updated,
      assignee: issue.fields.assignee?.displayName ?? 'Unassigned'
    };
  }

  async searchIssues(jql: string, maxResults: number = 10) {
    try {
      const response = await this.client.searchJira(jql, { maxResults });
      return {
        success: true,
        data: response.issues.map(this.formatIssueResponse)
      };
    } catch (error) {
      return {
        success: false,
        error: this.formatError(error)
      };
    }
  }

  async getIssue(issueKey: string) {
    try {
      const issue = await this.client.findIssue(issueKey) as JiraIssueResponse;
      return {
        success: true,
        data: this.formatIssueResponse(issue)
      };
    } catch (error) {
      return {
        success: false,
        error: this.formatError(error)
      };
    }
  }

  async createIssue(params: {
    project: string;
    summary: string;
    description: string;
    issueType: string;
  }) {
    try {
      const response = await this.client.addNewIssue({
        fields: {
          project: { key: params.project },
          summary: params.summary,
          description: params.description,
          issuetype: { name: params.issueType }
        }
      });
      return {
        success: true,
        data: {
          key: response.key,
          summary: params.summary
        }
      };
    } catch (error) {
      return {
        success: false,
        error: this.formatError(error)
      };
    }
  }

  static validateConfig(): string[] {
    const requiredEnvVars = ['JIRA_HOST', 'JIRA_API_TOKEN'] as const;
    return requiredEnvVars.filter(varName => !process.env[varName]);
  }
}

export const jiraToolSchemas = {
  searchIssues: {
    jql: z.string().describe("JQL query string"),
    maxResults: z.number().optional().describe("Maximum number of results to return")
  },
  getIssue: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)")
  },
  createIssue: {
    project: z.string().describe("Project key"),
    summary: z.string().describe("Issue summary"),
    description: z.string().describe("Issue description"),
    issueType: z.string().default("Task").describe("Issue type (e.g., Task, Bug, Story)")
  }
};
