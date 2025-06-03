import { z } from 'zod';
import { handleApiOperation } from '@atlassian-mcp-server/common';
import { IssueService, OpenAPI, SearchService } from './jira-client/index.js';

export class JiraService {
  constructor(host: string, token: string, fullBaseUrl?: string) {
    OpenAPI.BASE = fullBaseUrl ?? `https://${host}/rest`;
    OpenAPI.TOKEN = token;
    OpenAPI.VERSION = '2';
  }

  async searchIssues(jql: string, startAt?: number, expand?: string[], maxResults: number = 10) {
    return handleApiOperation(() => {
      return SearchService.searchUsingSearchRequest({
        jql,
        maxResults,
        expand,
        startAt
      });
    }, 'Error searching issues');
  }

  async getIssue(issueKey: string, expand?: string) {
    return handleApiOperation(() => IssueService.getIssue(issueKey, expand), 'Error getting issue');
  }

  async getIssueComments(issueKey: string, expand?: string) {
    return handleApiOperation(() => IssueService.getComments(issueKey, expand), 'Error getting issue comments');
  }

  async postIssueComment(issueKey: string, comment: string) {
    return handleApiOperation(() => IssueService.addComment(issueKey, undefined, { body: comment }), 'Error posting issue comment');
  }

  async createIssue(params: {
    projectId: string;
    summary: string;
    description: string;
    issueTypeId: string;
    fields?: Record<string, any> | string;
  }) {
    return handleApiOperation(async () => {
      const fields: Record<string, any> = {
        project: { key: params.projectId },
        summary: params.summary,
        description: params.description,
        issuetype: { id: params.issueTypeId }
      };

      // Add fields if provided
      if (params.fields) {
        try {
          // Parse fields if it's a string
          const fieldsObj = typeof params.fields === 'string'
            ? JSON.parse(params.fields)
            : params.fields;
          
          Object.entries(fieldsObj).forEach(([fieldId, value]) => {
            // Don't override the standard fields we've already set
            if (!['project', 'summary', 'description', 'issuetype'].includes(fieldId)) {
              fields[fieldId] = value;
            }
          });
        } catch (error) {
          console.error('Error processing fields:', error);
          // Continue with the request without the problematic fields
        }
      }

      return IssueService.createIssue(true, { fields });
    }, 'Error creating issue');
  }

  async updateIssue(issueKey: string, params: {
    fields?: Record<string, any> | string;
    update?: Record<string, any[]> | string;
    notifyUsers?: boolean;
  }) {
    return handleApiOperation(() => {
      const notifyUsersParam = params.notifyUsers === false ? 'false' : 'true';
      
      // Create the request body
      const requestBody: Record<string, any> = {};
      
      // Handle fields
      if (params.fields) {
        try {
          // Parse fields if it's a string
          const fieldsObj = typeof params.fields === 'string'
            ? JSON.parse(params.fields)
            : params.fields;
          
          // Only add the fields property if there are fields to update
          if (Object.keys(fieldsObj).length > 0) {
            requestBody.fields = fieldsObj;
          }
        } catch (error) {
          console.error('Error processing fields:', error);
          // Continue with the request without the problematic fields
        }
      }
      
      // Handle update operations
      if (params.update) {
        try {
          // Parse update if it's a string
          const updateObj = typeof params.update === 'string'
            ? JSON.parse(params.update)
            : params.update;
          
          // Add update operations if provided
          if (Object.keys(updateObj).length > 0) {
            requestBody.update = updateObj;
          }
        } catch (error) {
          console.error('Error processing update operations:', error);
          // Continue with the request without the update operations
        }
      }
      
      return IssueService.editIssue(issueKey, notifyUsersParam, requestBody);
    }, 'Error updating issue');
  }

  static validateConfig(): string[] {
    const requiredEnvVars = ['JIRA_API_TOKEN'] as const;
    const missingVars: string[] = requiredEnvVars.filter(varName => !process.env[varName]);
    if (!process.env.JIRA_HOST && !process.env.JIRA_API_BASE_PATH) {
      missingVars.push('JIRA_HOST or JIRA_API_BASE_PATH');
    }

    return missingVars;
  }
}

export const jiraToolSchemas = {
  searchIssues: {
    jql: z.string().describe("JQL query string"),
    maxResults: z.number().optional().describe("Maximum number of results to return"),
    startAt: z.number().optional().describe("Index of the first result to return"),
    expand: z.array(z.string()).optional().describe("Fields to expand")
  },
  getIssue: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    expand: z.string().optional().describe("Comma separated fields to expand")
  },
  getIssueComments: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    expand: z.string().optional().describe("Comma separated fields to expand")
  },
  postIssueComment: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    comment: z.string().describe("Comment text in the format suitable for JIRA DATA CENTER edition (JIRA Wiki Markup).")
  },
  createIssue: {
    projectId: z.string().describe("Project id"),
    summary: z.string().describe("Issue summary"),
    description: z.string().describe("Issue description in the format suitable for JIRA DATA CENTER edition (JIRA Wiki Markup)."),
    issueTypeId: z.string().describe("Issue type id (e.g. id of Task, Bug, Story). Should be found first a correct number for specific JIRA installation."),
    fields: z.union([
      z.record(z.any()).optional().describe("Additional fields to set on the issue in the format of { fieldName: value }"),
      z.string().optional().describe("Additional fields to set on the issue as a JSON string")
    ])
  },
  updateIssue: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    fields: z.union([
      z.record(z.any()).optional().describe("Fields to update in the format of { fieldName: value }"),
      z.string().optional().describe("Fields to update as a JSON string")
    ]),
    update: z.union([
      z.record(z.array(z.any())).optional().describe("Operations to perform on fields in the format of { fieldName: [operations] }"),
      z.string().optional().describe("Operations to perform on fields as a JSON string")
    ]),
    notifyUsers: z.boolean().optional().describe("Whether to notify users about the update. Defaults to true.")
  }
};
