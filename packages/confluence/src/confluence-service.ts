import { z } from 'zod';

export interface ConfluenceContent {
  id?: string;
  type: string;
  title: string;
  space: {
    key: string;
  };
  body?: {
    storage: {
      value: string;
      representation: 'storage';
    };
  };
  version?: {
    number: number;
    message?: string;
  };
  ancestors?: Array<{ id: string }>;
}

export class ConfluenceService {
  private baseUrl: string;
  private token: string;

  constructor(host: string, token: string) {
    this.baseUrl = `https://${host}/rest/api`;
    this.token = token;
  }

  private async request<T>(endpoint: string, options: any = {}): Promise<{ success: boolean; data?: T; error?: string }> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const responseData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: `Confluence API error: ${response.status} ${response.statusText}`,
          data: responseData
        };
      }

      return {
        success: true,
        data: responseData
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          error: `Confluence API Error: ${error.message}`
        };
      }
      return {
        success: false,
        error: 'Unknown Confluence API error occurred'
      };
    }
  }

  /**
   * Get a Confluence page by ID
   * @param contentId The ID of the page to retrieve
   * @param expand Optional comma-separated list of properties to expand
   */
  async getContent(contentId: string, expand?: string) {
    // Default expand to include body.storage to get the content
    const expandValue = expand || 'body.storage';
    // If expand is provided but doesn't include body.storage, add it
    const finalExpand = expand && !expand.includes('body.storage') 
      ? `${expand},body.storage` 
      : expandValue;
      
    return this.request(`/content/${contentId}?expand=${finalExpand}`);
  }

  /**
   * Search for content in Confluence using CQL
   * @param cql Confluence Query Language string
   * @param limit Maximum number of results to return
   * @param start Start index for pagination
   * @param expand Optional comma-separated list of properties to expand
   */
  async searchContent(cql: string, limit?: number, start?: number, expand?: string) {
    let queryParams = new URLSearchParams();
    queryParams.append('cql', cql);

    if (limit) queryParams.append('limit', limit.toString());
    if (start) queryParams.append('start', start.toString());
    if (expand) queryParams.append('expand', expand);

    return this.request(`/content/search?${queryParams.toString()}`);
  }

  /**
   * Create a new page in Confluence
   * @param content The content object to create
   */
  async createContent(content: ConfluenceContent) {
    return this.request('/content', {
      method: 'POST',
      body: JSON.stringify(content)
    });
  }

  /**
   * Update an existing page in Confluence
   * @param contentId The ID of the content to update
   * @param content The updated content object
   */
  async updateContent(contentId: string, content: ConfluenceContent) {
    return this.request(`/content/${contentId}`, {
      method: 'PUT',
      body: JSON.stringify(content)
    });
  }

  static validateConfig(): string[] {
    const requiredEnvVars = ['CONFLUENCE_HOST', 'CONFLUENCE_API_TOKEN'] as const;
    return requiredEnvVars.filter(varName => !process.env[varName]);
  }
}

export const confluenceToolSchemas = {
  getContent: {
    contentId: z.string().describe("Confluence content ID"),
    expand: z.string().optional().describe("Comma-separated list of properties to expand")
  },
  searchContent: {
    cql: z.string().describe("Confluence Query Language (CQL) search string"),
    limit: z.number().optional().describe("Maximum number of results to return"),
    start: z.number().optional().describe("Start index for pagination"),
    expand: z.string().optional().describe("Comma-separated list of properties to expand")
  },
  createContent: {
    title: z.string().describe("Title of the content"),
    spaceKey: z.string().describe("Space key where content will be created"),
    type: z.string().default("page").describe("Content type (page, blogpost, etc)"),
    content: z.string().describe("Content body in storage format"),
    parentId: z.string().optional().describe("ID of the parent page (if creating a child page)")
  },
  updateContent: {
    contentId: z.string().describe("ID of the content to update"),
    title: z.string().optional().describe("New title of the content"),
    content: z.string().optional().describe("New content body in storage format"),
    version: z.number().describe("New version number (must be incremented)"),
    versionComment: z.string().optional().describe("Comment for this version")
  }
};
