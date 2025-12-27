import { Request, Response } from 'express';
import { AuditEvent, AuditEventPage } from '../types/audit';
import { AuditService } from '../services/audit';
import { AuditEventsQuery, AuditEventIdParam } from '../validators/audit';

// Type for validated audit events request
type AuditEventsRequest = Request<{}, AuditEventPage, {}, AuditEventsQuery>;

// Type for validated single event request
type AuditEventByIdRequest = Request<AuditEventIdParam, AuditEvent | { error: string }, {}>;

/**
 * Controller for audit events
 * Handles business logic delegation and response formatting
 * Validation is handled by middleware
 */

/**
 * Get paginated list of audit events with optional filters
 * Query params are validated by Zod middleware
 */
export const getAuditEvents = (req: any, res: Response<AuditEventPage>): void => {
    try {
        // Query params are already validated and typed by middleware
        const params = req.query;

        // Call business logic layer
        const result: AuditEventPage = AuditService.getEvents(params);

        // Return successful response
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in getAuditEvents:', error);
        res.status(500).json({
            page: 1,
            pageSize: 50,
            total: 0,
            items: [],
        } as AuditEventPage);
    }
};

/**
 * Get single audit event by ID
 * ID param is validated by Zod middleware
 */
export const getAuditEventById = (
    req: AuditEventByIdRequest,
    res: Response<AuditEvent | { error: string }>
): void => {
    try {
        // ID is already validated by middleware
        const { id } = req.params;

        // Call business logic layer
        const event: AuditEvent | null = AuditService.getEventById(id);

        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }

        // Return successful response
        res.status(200).json(event);
    } catch (error) {
        console.error('Error in getAuditEventById:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
