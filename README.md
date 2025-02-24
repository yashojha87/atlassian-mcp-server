# Atlassian Data Center MCP

This project provides a Model Context Protocol (MCP) integration for Atlassian Data Center products, including Jira, Confluence, and Bitbucket.

## Overview

The Atlassian DC MCP allows AI assistants to interact with Atlassian products through a standardized interface. It provides tools for:

- **Jira**: Search, view, and create issues
- **Confluence**: Access and manage content
- **Bitbucket**: Interact with repositories and code

## Prerequisites

- Node.js 18 or higher
- npm 7 or higher (for workspaces support)
- Atlassian Data Center instance or Cloud instance
- API tokens for the Atlassian products you want to use

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/atlassian-dc-mcp.git
cd atlassian-dc-mcp
```

## Development

This project is structured as an npm monorepo using workspaces. The workspaces are organized in the `packages/` directory, with separate packages for each Atlassian product integration.

### Installing Dependencies

To install all dependencies for all packages in the monorepo:

```bash
npm install
```

This will install:
- Root-level dependencies defined in the root `package.json`
- All dependencies for each package in the workspaces

To install a dependency for a specific package:

```bash
npm install <package-name> --workspace=@atlassian-dc-mcp/jira
```

To install a dependency at the root level:

```bash
npm install <package-name> -W
```

### Building the Project

To build all packages:

```bash
npm run build
```

To build a specific package:

```bash
npm run build --workspace=@atlassian-dc-mcp/jira
```

### Running in Development Mode

To run a specific package in development mode:

```bash
npm run dev:jira     # For Jira
npm run dev:confluence  # For Confluence
npm run dev:bitbucket   # For Bitbucket
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```
# Jira configuration
JIRA_HOST=your-instance.atlassian.net
JIRA_API_TOKEN=your-api-token

# Confluence configuration
CONFLUENCE_HOST=your-instance.atlassian.net
CONFLUENCE_API_TOKEN=your-api-token

# Bitbucket configuration
BITBUCKET_HOST=your-instance.atlassian.net
BITBUCKET_API_TOKEN=your-api-token
```

## License

[MIT](LICENSE)
