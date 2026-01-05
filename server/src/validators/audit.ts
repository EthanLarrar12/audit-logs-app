import { z } from 'zod';

/**
 * Zod schema for audit events query parameters
 */
export const auditEventsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    actorUsername: z.string().optional(),
    category: z.string().optional(),
    action: z.string().optional(),
    searchInput: z.string().optional(),
    actorSearch: z.string().optional(),
    targetSearch: z.string().optional(),
    resourceSearch: z.string().optional(),
    sort: z.enum(['created_at', 'action', 'actor_username', 'target_name']).optional().default('created_at'),
    order: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Zod schema for audit event ID parameter
 */
export const auditEventIdParamSchema = z.object({
    id: z.string().uuid('Invalid event ID format'),
});

// Export inferred types
export type AuditEventsQuery = z.infer<typeof auditEventsQuerySchema>;
export type AuditEventIdParam = z.infer<typeof auditEventIdParamSchema>;
