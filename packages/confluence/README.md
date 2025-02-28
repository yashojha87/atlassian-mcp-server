# Atlassian Confluence MCP

This package provides a Machine Comprehension Protocol (MCP) server for interacting with Atlassian Confluence.

## Features

- Get content by ID
- Search for content using CQL (Confluence Query Language)
- Create new content (pages, blog posts)
- Update existing content

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the packages/confluence directory with the following variables:
   ```
   CONFLUENCE_HOST=your-confluence-instance.atlassian.net
   CONFLUENCE_API_TOKEN=your-personal-access-token
   ```

   To create a personal access token:
   - In Confluence, select your profile picture at the top right
   - Select **Settings** > **Personal Access Tokens**
   - Select **Create token** and give it a name
   - Copy the token and store it securely (you won't be able to see it again)

## Usage

Start the MCP server:

```
npm run build
npm start
```

Or for development with auto-reload:

```
npm run dev
```

### Available Tools

#### 1. confluence_getContent

Get Confluence content by ID.

Parameters:
- `contentId` (string, required): The ID of the content to retrieve
- `expand` (string, optional): Comma-separated list of properties to expand (e.g., "body.storage,version")

#### 2. confluence_searchContent

Search for content in Confluence using CQL.

Parameters:
- `cql` (string, required): Confluence Query Language search string
- `limit` (number, optional): Maximum number of results to return
- `start` (number, optional): Start index for pagination
- `expand` (string, optional): Comma-separated list of properties to expand

#### 3. confluence_createContent

Create new content in Confluence.

Parameters:
- `title` (string, required): Title of the content
- `spaceKey` (string, required): Space key where content will be created
- `type` (string, default: "page"): Content type (page, blogpost, etc)
- `content` (string, required): Content body in storage format (Confluence's HTML-like format)
- `parentId` (string, optional): ID of the parent page (if creating a child page)

#### 4. confluence_updateContent

Update existing content in Confluence.

Parameters:
- `contentId` (string, required): ID of the content to update
- `title` (string, optional): New title of the content
- `content` (string, optional): New content body in storage format
- `version` (number, required): New version number (must be incremented from current version)
- `versionComment` (string, optional): Comment for this version

## Examples

### Get a page by ID

```javascript
const response = await fetch('http://localhost:3000/api/tools/confluence_getContent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contentId: '123456',
    expand: 'body.storage,version'
  })
});
```

### Create a new page

```javascript
const response = await fetch('http://localhost:3000/api/tools/confluence_createContent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My New Page',
    spaceKey: 'DEMO',
    content: '<p>This is the content of my new page.</p>',
    type: 'page'
  })
});
```

### Update an existing page

```javascript
const response = await fetch('http://localhost:3000/api/tools/confluence_updateContent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contentId: '123456',
    title: 'Updated Page Title',
    content: '<p>This is the updated content.</p>',
    version: 2,
    versionComment: 'Updated via API'
  })
});
```
