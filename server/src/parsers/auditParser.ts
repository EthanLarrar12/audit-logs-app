import { AuditEvent, AuditEventPage } from "../types/audit";

/**
 * Parser utilities for transforming GraphQL responses to domain models
 */

interface GraphQLAuditNode {
  id: string;
  actionId: string;
  updatedAt: string | number;
  category: string;
  actorId: string;
  actorUsername: string;
  actorType?: string;
  executorId: string;
  executorName: string;
  action: string;
  resourceName?: string;
  resourceId?: string;
  targetId: string;
  targetName: string;
  targetType: string | null;
  resourceType: string | null;
  recordDatumByActionId?: {
    changes?: {
      before?: Record<string, unknown>;
      after?: Record<string, unknown>;
    };
  };
}

interface GraphQLAuditEventsResponse {
  data?: {
    allRecords?: {
      totalCount: number;
      nodes: GraphQLAuditNode[];
    };
  };
  errors?: Array<{ message: string }>;
}

interface GraphQLAuditEventByIdResponse {
  data?: {
    recordById?: GraphQLAuditNode;
  };
  errors?: Array<{ message: string }>;
}

/**
 * Parse a single GraphQL node to AuditEvent
 */
export const parseAuditEventNode = (node: GraphQLAuditNode): AuditEvent => {
  const changes = node.recordDatumByActionId?.changes;

  // Handle timestamp conversion - could be string or number
  let timestamp: string;
  if (typeof node.updatedAt === "number") {
    timestamp = new Date(node.updatedAt).toISOString();
  } else {
    timestamp = new Date(parseInt(node.updatedAt)).toISOString();
  }

  return {
    id: node.id,
    created_at: timestamp,
    category: node.category,
    actor_type: (node.actorType as AuditEvent["actor_type"]) || "SYSTEM", // Fallback to SYSTEM if no executorType is present
    actor_id: node.actorId || node.executorId,
    actor_username: node.actorUsername || node.executorName,
    action: node.action,
    resource_name: node.resourceName || node.resourceId || "",
    resource_id: node.resourceId || "",
    resource_type: node.resourceType,
    target_id: node.targetId,
    target_name: node.targetName || node.targetId,
    target_type: node.targetType,
    before_state: changes?.before || null,
    after_state: changes?.after || null,
    context: null,
  };
};

/**
 * Parse the full paginated audit events response
 */
export const parseAuditEventsResponse = (
  response: GraphQLAuditEventsResponse,
  page: number,
): AuditEventPage => {
  // Handle errors
  if (response.errors && response.errors.length > 0) {
    throw new Error(
      `GraphQL Errors: ${response.errors.map((e) => e.message).join(", ")}`,
    );
  }

  // Handle missing data
  if (!response.data || !response.data.allRecords) {
    throw new Error("No data returned from GraphQL");
  }

  const { nodes } = response.data.allRecords;

  // Parse all nodes
  const items: AuditEvent[] = nodes.map(parseAuditEventNode);

  return {
    page,
    items,
  };
};

/**
 * Parse single audit event by ID response
 */
export const parseAuditEventByIdResponse = (
  response: GraphQLAuditEventByIdResponse,
): AuditEvent | null => {
  // Handle errors
  if (response.errors && response.errors.length > 0) {
    console.error("GraphQL Error:", response.errors);
    return null;
  }

  // Handle missing data
  const node = response.data?.recordById;
  if (!node) {
    return null;
  }

  return parseAuditEventNode(node);
};
interface GraphQLSuggestionsResponse {
  data?: {
    allRecords?: {
      nodes: Array<{
        executorId: string;
        executorName: string;
        actorType: string;
        targetId: string;
        targetName: string;
        resourceId: string;
        resourceName: string;
        targetType: string;
        resourceType: string;
      }>;
    };
  };
  errors?: Array<{ message: string }>;
}

export interface SuggestionResult {
  id: string;
  name: string | null;
  type: string; // The category (USER, SHOS, etc.)
}

/**
 * Parse GraphQL response for suggestions and extract unique values with categories
 */
export const parseSuggestionsResponse = (
  response: GraphQLSuggestionsResponse,
  term: string,
): SuggestionResult[] => {
  if (response.errors && response.errors.length > 0) {
    throw new Error(
      `GraphQL Errors: ${response.errors.map((e) => e.message).join(", ")}`,
    );
  }

  if (!response.data || !response.data.allRecords) {
    return [];
  }

  const { nodes } = response.data.allRecords;
  const suggestionsMap = new Map<string, SuggestionResult>();
  const lowerTerm = term.toLowerCase();

  nodes.forEach((node) => {
    // Map fields to their corresponding categories
    const fields: Array<{ id: string; name: string | null; category: string }> =
      [
        {
          id: node.executorId,
          name: node.executorName || null,
          category: node.actorType || "SYSTEM",
        },
        {
          id: node.targetId,
          name: node.targetName || null,
          category: node.targetType,
        },
        {
          id: node.resourceId,
          name: node.resourceName || null,
          category: node.resourceType,
        },
      ];

    fields.forEach(({ id, name, category }) => {
      const matchesId = id && id.toLowerCase().includes(lowerTerm);
      const matchesName = name && name.toLowerCase().includes(lowerTerm);

      if (matchesId || matchesName) {
        const key = `${id}:${category}`;
        if (!suggestionsMap.has(key)) {
          suggestionsMap.set(key, { id, name, type: category });
        }
      }
    });
  });

  return Array.from(suggestionsMap.values())
    .sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id))
    .slice(0, 10);
};

interface GraphQLSearchFiltersResponse {
  data?: {
    getSearchFilters?: {
      nodes: Array<{
        id: string;
        name: string;
        type: string;
      }>;
    };
  };
  errors?: Array<{ message: string }>;
}

/**
 * Parse response from getSearchFilters DB function
 */
export const parseSearchFiltersResponse = (
  response: GraphQLSearchFiltersResponse,
): SuggestionResult[] => {
  if (response.errors && response.errors.length > 0) {
    throw new Error(
      `GraphQL Errors: ${response.errors.map((e) => e.message).join(", ")}`,
    );
  }

  if (!response.data || !response.data.getSearchFilters) {
    return [];
  }

  return response.data.getSearchFilters.nodes.map((node) => ({
    id: node.id,
    name: node.name,
    type: node.type,
  }));
};
