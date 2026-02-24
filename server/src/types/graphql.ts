/**
 * Types representing the PostGraphile filter DSL used when building
 * and asserting on GraphQL query filters throughout the codebase.
 */

/** A single field-level condition (equality, inequality, inclusion, etc.) */
export interface GraphQLFieldCondition {
  equalTo?: string;
  notEqualTo?: string;
  in?: string[];
  includesInsensitive?: string;
}

/**
 * A single condition node inside a PostGraphile `and`/`or` filter array.
 * Recursive so that compound `and` / `or` clauses are fully typed.
 */
export interface GraphQLFilter {
  targetType?: GraphQLFieldCondition;
  targetId?: GraphQLFieldCondition;
  targetName?: GraphQLFieldCondition;
  resourceType?: GraphQLFieldCondition;
  resourceId?: GraphQLFieldCondition;
  resourceName?: GraphQLFieldCondition;
  executorId?: GraphQLFieldCondition;
  executorName?: GraphQLFieldCondition;
  executorType?: GraphQLFieldCondition;
  historyAction?: GraphQLFieldCondition;
  insertTime?: { greaterThanOrEqualTo?: number; lessThanOrEqualTo?: number };
  or?: GraphQLFilter[];
  and?: GraphQLFilter[];
}

/** Top-level filter wrapper passed as a GraphQL variable */
export interface GraphQLFilterVariable {
  and?: GraphQLFilter[];
  or?: GraphQLFilter[];
}

/** Raw response shape returned by performQuery for context/filter queries */
export interface GraphQLContextResult {
  data?: Record<string, unknown>;
  errors?: Array<{ message: string }>;
}
