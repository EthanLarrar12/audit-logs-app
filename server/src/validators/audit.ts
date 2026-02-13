import { z } from "zod";

/**
 * Zod schema for audit events query parameters
 */
export const auditEventsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  actorUsername: z.string().optional(),
  category: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => (val ? (Array.isArray(val) ? val : [val]) : undefined)),
  action: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => (val ? (Array.isArray(val) ? val : [val]) : undefined)),
  searchInput: z.string().optional(),
  searchType: z.string().optional(),
  exactSearch: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean().optional(),
  ),
  actorSearch: z.string().optional(),
  targetSearch: z.string().optional(),
  resourceSearch: z.string().optional(),
  premadeProfile: z.string().optional(),
  sort: z
    .enum(["created_at", "action", "actor_username", "target_name"])
    .optional()
    .default("created_at"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

/**
 * Zod schema for audit event ID parameter
 */
export const auditEventIdParamSchema = z.object({
  id: z.string().uuid("Invalid event ID format"),
});

/**
 * Zod schema for suggestions query parameters
 */
export const suggestionsQuerySchema = z.object({
  term: z.string().min(1),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});

/**
 * Zod schema for history deletion body
 */
export const deleteHistorySchema = z.object({
  startDate: z.number().int().min(0),
  endDate: z.number().int().min(0),
});

// Export inferred types
export type AuditEventsQuery = z.infer<typeof auditEventsQuerySchema>;
export type AuditEventIdParam = z.infer<typeof auditEventIdParamSchema>;
export type SuggestionsQuery = z.infer<typeof suggestionsQuerySchema>;
export type DeleteHistoryBody = z.infer<typeof deleteHistorySchema>;
