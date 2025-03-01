import { z } from 'zod';
import { OpenAPI, ProjectService, RepositoryService } from './bitbucket-client/index.js';

export class BitbucketService {
  constructor(host: string, token: string) {
    // Configure the OpenAPI client
    OpenAPI.BASE = `https://${host}/rest`;
    OpenAPI.TOKEN = token;
    OpenAPI.VERSION = '1.0';
  }

  /**
   * Get commits for a repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @param path Optional path to filter commits by
   * @param since Optional commit ID to retrieve commits after
   * @param until Optional commit ID to retrieve commits before
   * @param limit Optional pagination limit (default: 25)
   * @returns Promise with commits data
   */
  async getCommits(projectKey: string, repositorySlug: string, path?: string, since?: string, until?: string, limit: number = 25) {
    try {
      const response = await RepositoryService.getCommits(
        projectKey, 
        repositorySlug, 
        undefined, // avatarScheme
        path,
        undefined, // withCounts
        undefined, // followRenames
        until,
        undefined, // avatarSize
        since,
        undefined, // merges
        undefined, // ignoreMissing
        0, // start
        limit
      );
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        data: {
          message: `Error fetching commits: ${error instanceof Error ? error.message : String(error)}`
        }
      };
    }
  }

  /**
   * Get a list of projects
   * @param name Optional filter by project name
   * @param permission Optional filter by permission
   * @param start Optional pagination start
   * @param limit Optional pagination limit (default: 25)
   * @returns Promise with projects data
   */
  async getProjects(name?: string, permission?: string, start?: number, limit: number = 25) {
    try {
      const response = await ProjectService.getProjects(name, permission, start, limit);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        data: {
          message: `Error fetching projects: ${error instanceof Error ? error.message : String(error)}`
        }
      };
    }
  }

  /**
   * Get a specific project by key
   * @param projectKey The project key
   * @returns Promise with project data
   */
  async getProject(projectKey: string) {
    try {
      const response = await ProjectService.getProject(projectKey);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        data: {
          message: `Error fetching project: ${error instanceof Error ? error.message : String(error)}`
        }
      };
    }
  }

  /**
   * Get repositories for a project
   * @param projectKey The project key
   * @param start Optional pagination start
   * @param limit Optional pagination limit (default: 25)
   * @returns Promise with repositories data
   */
  async getRepositories(projectKey: string, start?: number, limit: number = 25) {
    try {
      const response = await ProjectService.getRepositories(projectKey, start, limit);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        data: {
          message: `Error fetching repositories: ${error instanceof Error ? error.message : String(error)}`
        }
      };
    }
  }

  /**
   * Get a specific repository
   * @param projectKey The project key
   * @param repositorySlug The repository slug
   * @returns Promise with repository data
   */
  async getRepository(projectKey: string, repositorySlug: string) {
    try {
      const response = await ProjectService.getRepository(projectKey, repositorySlug);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        data: {
          message: `Error fetching repository: ${error instanceof Error ? error.message : String(error)}`
        }
      };
    }
  }

  static validateConfig(): string[] {
    const requiredEnvVars = ['BITBUCKET_HOST', 'BITBUCKET_API_TOKEN'] as const;
    return requiredEnvVars.filter(varName => !process.env[varName]);
  }
}

export const bitbucketToolSchemas = {
  getProjects: {
    name: z.string().optional().describe("Filter projects by name"),
    permission: z.string().optional().describe("Filter projects by permission"),
    start: z.number().optional().describe("Start number for pagination"),
    limit: z.number().optional().default(25).describe("Number of items to return")
  },
  getProject: {
    projectKey: z.string().describe("The project key")
  },
  getRepositories: {
    projectKey: z.string().describe("The project key"),
    start: z.number().optional().describe("Start number for pagination"),
    limit: z.number().optional().default(25).describe("Number of items to return")
  },
  getRepository: {
    projectKey: z.string().describe("The project key"),
    repositorySlug: z.string().describe("The repository slug")
  },
  getCommits: {
    projectKey: z.string().describe("The project key"),
    repositorySlug: z.string().describe("The repository slug"),
    path: z.string().optional().describe("Optional path to filter commits by"),
    since: z.string().optional().describe("The commit ID (exclusively) to retrieve commits after"),
    until: z.string().optional().describe("The commit ID (inclusively) to retrieve commits before"),
    limit: z.number().optional().default(25).describe("Number of items to return")
  }
};
