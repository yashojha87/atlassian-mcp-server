// Define the types for the simplified JIRA issue
interface SimplifiedUser {
  displayName: string;
  emailAddress: string;
}

interface SimplifiedParent {
  key: string;
  summary: string;
  status: string;
}

interface SimplifiedComponent {
  name: string;
}

interface SimplifiedSprint {
  name: string;
  state: string;
  startDate: string;
  endDate: string;
  goal: string;
}

export interface SimplifiedJiraIssue {
  key: string;
  summary: string;
  status: string;
  issueType: string;
  priority: string;
  created: string;
  updated: string;
  resolved?: string;
  description?: string;
  assignee?: SimplifiedUser;
  reporter?: SimplifiedUser;
  project: {
    key: string;
    name: string;
  };
  parent?: SimplifiedParent;
  components: string[];
  labels: string[];
  sprints?: SimplifiedSprint[];
  commentCount: number;
  comments: any[];
}

/**
 * Extracts relevant information from a JIRA API response for use in LLM conversations
 * Removes unnecessary technical details, URLs, and internal IDs
 *
 * @param data - The full JIRA API response
 * @returns A simplified JIRA issue object with only relevant fields
 */
function extractJiraDataForLLM(data: any): SimplifiedJiraIssue | null {
  const fields = data.fields;

  const formatDate = (dateString: string | null): string | undefined => {
    if (!dateString) return undefined;
    return new Date(dateString).toISOString();
  };

  // Extract parent information if it exists
  const parent = fields.parent ? {
    key: fields.parent.key,
    summary: fields.parent.fields.summary,
    status: fields.parent.fields.status.name
  } : undefined;

  // Extract components
  const components = (fields.components || []).map((comp: any) => comp.name);

  // Extract sprints (both active and closed)
  const sprints: SimplifiedSprint[] = [];

  // First check for active sprints
  if (fields.sprint) {
    sprints.push({
      name: fields.sprint.name,
      state: fields.sprint.state,
      startDate: formatDate(fields.sprint.startDate) || '',
      endDate: formatDate(fields.sprint.endDate) || '',
      goal: fields.sprint.goal || ''
    });
  }

  // Then add closed sprints
  if (fields.closedSprints && fields.closedSprints.length > 0) {
    fields.closedSprints.forEach((sprint: any) => {
      sprints.push({
        name: sprint.name,
        state: sprint.state,
        startDate: formatDate(sprint.startDate) || '',
        endDate: formatDate(sprint.endDate) || '',
        goal: sprint.goal || ''
      });
    });
  }

  return {
    key: data.key,
    summary: fields.summary,
    status: fields.status?.name || 'Unknown',
    issueType: fields.issuetype?.name || 'Unknown',
    priority: fields.priority?.name || 'None',
    created: formatDate(fields.created) || '',
    updated: formatDate(fields.updated) || '',
    resolved: formatDate(fields.resolutiondate),
    description: fields.description || undefined,
    assignee: fields.assignee ? {
      displayName: fields.assignee.displayName,
      emailAddress: fields.assignee.emailAddress
    } : undefined,
    reporter: fields.reporter ? {
      displayName: fields.reporter.displayName,
      emailAddress: fields.reporter.emailAddress
    } : undefined,
    project: {
      key: fields.project.key,
      name: fields.project.name
    },
    parent,
    components,
    labels: fields.labels || [],
    comments: fields.comment.comments,
    commentCount: fields.comment?.total || 0
  };
}

export { extractJiraDataForLLM };
