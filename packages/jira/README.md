# Atlassian Jira Data Center MCP

This package provides a Machine Comprehension Protocol (MCP) server for interacting with Atlassian Jira Data Center edition.

## Claude Desktop Configuration

To use this MCP connector with Claude Desktop, add the following to your Claude Desktop configuration:

macOS:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

Windows:
```
%APPDATA%\Claude\claude_desktop_config.json
```

```json
{
  "mcpServers": {
    "atlassian-jira-dc": {
      "command": "npx",
      "args": ["-y", "@atlassian-mcp-server/jira"],
      "env": {
        "JIRA_HOST": "your-jira-host",
        "JIRA_API_TOKEN": "your-token"
      }
    }
  }
}
```

Note: Set `JIRA_HOST` variable only to domain + port without a protocol (e.g., `your-instance.atlassian.net`). The https protocol is assumed.

Alternatively, you can use `JIRA_API_BASE_PATH` instead of `JIRA_HOST` to specify the complete API base URL including protocol (e.g., `https://your-instance.atlassian.net/rest`). Note that the `/api/2/search/` part is static and added automatically in the code, so you don't need to include it in the `JIRA_API_BASE_PATH` value.

## Features

- Search for issues using JQL (Jira Query Language)
- Get issue details by key
- Get issue comments
- Create and update issues with support for custom fields
- Add comments to issues

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the packages/jira directory with the following variables:
   ```
   JIRA_HOST=your-jira-instance.atlassian.net
   # OR alternatively use
   # JIRA_API_BASE_PATH=https://your-jira-instance.atlassian.net/rest
   # Note: /api/latest/ is added automatically, do not include it
   JIRA_API_TOKEN=your-personal-access-token
   ```

   To create a personal access token:
  - In Jira, select your profile picture at the top right
  - Select **Personal Access Tokens**
  - Select **Create token** and give it a name
  - Copy the token and store it securely (you won't be able to see it again)

## Usage

Start the MCP server:

```
npm run build
```

Or for development with auto-reload:

```
npm run dev
```

### Available Tools

#### 1. jira_searchIssues

Search for JIRA issues using JQL in the JIRA Data Center edition instance.

Parameters:
- `jql` (string, required): JIRA Query Language search string
- `expand` (array, optional): Fields to expand in the response
- `startAt` (number, optional): Starting index for pagination
- `maxResults` (number, optional): Maximum number of results to return (default: 10)

#### 2. jira_getIssue

Get details of a JIRA issue by its key from the JIRA Data Center edition instance.

Parameters:
- `issueKey` (string, required): The issue key (e.g., "PROJECT-123")
- `expand` (string, optional): Comma-separated list of fields to expand

#### 3. jira_getIssueComments

Get comments for a JIRA issue from the JIRA Data Center edition instance.

Parameters:
- `issueKey` (string, required): The issue key (e.g., "PROJECT-123")
- `expand` (string, optional): Comma-separated list of fields to expand

#### 4. jira_createIssue

Create a new issue in the JIRA Data Center edition instance.

Parameters:
- `projectId` (string, required): ID of the project
- `summary` (string, required): Issue summary
- `description` (string, required): Issue description in format suitable for JIRA Data Center edition (JIRA Wiki Markup)
- `issueTypeId` (string, required): ID of the issue type
- `fields` (object or string, optional): Additional fields to set on the issue, including custom fields. Custom fields should be included directly in this object.

Example with custom fields in the fields object:
```json
{
  "projectId": "PROJECT",
  "summary": "Issue summary",
  "description": "Issue description",
  "issueTypeId": "10001",
  "fields": {
    "customfield_10010": "Value for custom field 10010",
    "customfield_10011": { "id": "10000" },
    "customfield_48401": { "id": "109758" }
  }
}
```

The format of custom field values depends on the field type:
- Simple text/number fields: Use simple string or number values
- Select/option fields: Use an object with an `id` property (e.g., `"customfield_48401": { "id": "109758" }`)
- Multi-select fields: Use an array of values or objects

#### 5. jira_postIssueComment

Add a comment to a JIRA issue in the JIRA Data Center edition instance.

Parameters:
- `issueKey` (string, required): The issue key (e.g., "PROJECT-123")
- `comment` (string, required): Comment text in format suitable for JIRA Data Center edition (JIRA Wiki Markup)

#### 6. jira_updateIssue

Update an existing issue in the JIRA Data Center edition instance.

Parameters:
- `issueKey` (string, required): The issue key (e.g., "PROJECT-123")
- `fields` (object, optional): Fields to update in the format of { fieldName: value }. Custom fields should be included directly in this object.
- `update` (object, optional): Operations to perform on fields, such as 'set', 'add', 'remove' in the format of { fieldName: [operations] }
- `notifyUsers` (boolean, optional): Whether to notify watchers (default: true)

it's recommended to include custom fields directly in the `fields` object, which is more straightforward and the preferred approach for MCP Inspector usage.

Example with custom fields directly in the fields object (recommended approach):
```json
{
  "issueKey": "PROJECT-123",
  "fields": {
    "summary": "Updated summary",
    "description": "Updated description",
    "customfield_10011": { "id": "10001" },
    "customfield_48401": { "id": "109758" }
  },
  "notifyUsers": false
}
```

The format of custom field values depends on the field type:
- Simple text/number fields: Use simple string or number values
- Select/option fields: Use an object with an `id` property (e.g., `"customfield_48401": { "id": "109758" }`)
- Multi-select fields: Use an array of values or objects

## For AI Tools and LLM Integration

This section provides specific guidance for AI tools and Large Language Models (LLMs) integrating with the Jira Data Center MCP.

### Using jira_createIssue for AI Applications

When implementing AI tools that need to create Jira issues, follow these best practices:

1. **Field Structure**: Always use the recommended approach of including custom fields directly in the `fields` object:

```json
{
  "projectId": "PROJECT-KEY",  // Use the project key, not the numeric ID
  "summary": "Concise issue title",
  "description": "Detailed description with relevant context",
  "issueTypeId": "10001",      // You'll need to know the correct issueTypeId
  "fields": {
    "customfield_10010": "Value for custom field 10010",
    "customfield_10011": { "id": "10000" },
    "customfield_48401": { "id": "109758" }
  }
}
```

2. **Finding Field IDs**: Custom field IDs can be found by:
   - Using the Jira API to list available fields
   - Examining the HTML source of the Jira issue creation form
   - Creating a test issue via the UI and then retrieving it with `jira_getIssue`

3. **Field Value Formats**:
   - Text fields: Simple strings
   - Select/option fields: Objects with an `id` property (e.g., `{"id": "109758"}`)
   - Multi-select fields: Arrays of values or objects with ids
   - User fields: Objects with either `name` or `accountId` (e.g., `{"accountId": "5b10a2844c20165700ede21g"}`)
   - Date fields: Strings in ISO format (e.g., `"2025-06-03"`)

4. **Error Handling**: Be prepared to handle these common errors:
   - Invalid project key
   - Missing required fields
   - Incorrect issue type ID
   - Invalid custom field format

### Using jira_updateIssue for AI Applications

When implementing AI tools that need to update Jira issues, follow these guidelines:

1. **Field Updates**: Always include custom fields directly in the `fields` object:

```json
{
  "issueKey": "PROJECT-123",
  "fields": {
    "summary": "Updated summary",
    "description": "Updated description with new information",
    "customfield_10010": "Updated value for custom field 10010",
    "customfield_10011": { "id": "10001" },
    "customfield_48401": { "id": "109758" }
  },
  "notifyUsers": false
}
```

2. **Selective Updates**: Only include fields you want to change. Fields not included in the request will remain unchanged.

3. **Complex Updates**: For operations like adding/removing values from multi-value fields, use the `update` parameter:

```json
{
  "issueKey": "PROJECT-123",
  "update": {
    "labels": [
      {"add": "new-label"},
      {"remove": "old-label"}
    ],
    "components": [
      {"add": {"name": "Component1"}}
    ]
  }
}
```

4. **Transitions**: To move an issue through a workflow, first retrieve available transitions with the Jira API, then update with the appropriate transition ID.

5. **Permissions**: Ensure your API token has the necessary permissions to modify the issues in question.

### Example AI Tool Implementation Pattern

Here's a pattern for AI tools to follow when working with Jira issues:

1. **Information Gathering**: Collect all necessary information before making API calls
2. **Validation**: Validate input data before sending to the API
3. **Execution**: Make the API call with properly formatted data
4. **Error Handling**: Handle errors gracefully with helpful messages
5. **Confirmation**: Confirm successful operations and provide feedback

This approach ensures reliable integration between AI systems and Jira.
