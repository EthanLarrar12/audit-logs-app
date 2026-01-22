import { RequestHandler } from 'express';
import { AuditEvent, AuditEventPage } from '../types/audit';
import { AuditService } from '../BLs/audit';
import { AuditEventsQuery, AuditEventIdParam, SuggestionsQuery } from '../validators/audit';

/**
 * Controller for audit events
 * Handles business logic delegation and response formatting
 * Validation is handled by middleware
 */

/**
 * Get paginated list of audit events with optional filters
 * Query params are validated by Zod middleware
 */
export const getAuditEvents: RequestHandler = async (req, res): Promise<void> => {
    try {
        // Query params are already validated and typed by middleware
        const params = req.query as unknown as AuditEventsQuery;

        // Call business logic layer
        const result: AuditEventPage = await AuditService.getEvents(params);

        // Return successful response
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in getAuditEvents:', error);
        res.status(500).json({
            page: 1,
            items: [],
        } as AuditEventPage);
    }
};

/**
 * Get single audit event by ID
 * ID param is validated by Zod middleware
 */
export const getAuditEventById: RequestHandler = async (req, res): Promise<void> => {
    try {
        // ID is already validated by middleware
        const { id } = req.params as unknown as AuditEventIdParam;

        // Call business logic layer
        const event: AuditEvent | null = await AuditService.getEventById(id);

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

/**
 * Get all available premade profiles
 */
export const getPremadeProfiles: RequestHandler = async (req, res): Promise<void> => {
    try {
        const profiles = await AuditService.getPremadeProfiles();
        res.status(200).json(profiles);
    } catch (error) {
        console.error('Error in getPremadeProfiles:', error);
        res.status(500).json([]);
    }
};

/**
 * Get autocomplete suggestions for general search
 * Term param is validated by Zod middleware
 */
export const getSuggestions: RequestHandler = async (req, res): Promise<void> => {
    try {
        const { term } = req.query as unknown as SuggestionsQuery;
        const result = await AuditService.getSuggestions({ term });
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in getSuggestions:', error);
        res.status(500).json([]);
    }
};

