import { z } from 'zod';
import fetch from 'node-fetch';

export class ConfluenceService {
  private baseUrl: string;
  private token: string;

  constructor(host: string, token: string) {
    this.baseUrl = `https://${host}/wiki/rest/api`;
    this.token = token;
  }

  private async request(endpoint: string, options: any = {}) {
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

      if (!response.ok) {
        throw new Error(`Confluence API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
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

  // Placeholder for future methods
  async getPage(pageId: string) {
    return {
      success: true,
      data: {
        message: `This is a placeholder for getting Confluence page ${pageId}`
      }
    };
  }

  static validateConfig(): string[] {
    const requiredEnvVars = ['CONFLUENCE_HOST', 'CONFLUENCE_API_TOKEN'] as const;
    return requiredEnvVars.filter(varName => !process.env[varName]);
  }
}

export const confluenceToolSchemas = {
  getPage: {
    pageId: z.string().describe("Confluence page ID")
  }
};
