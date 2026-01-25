import { RequestHandler } from 'express';
import { AuditEvent, AuditEventPage } from '../types/audit';
import { getEvents, getEventById, getPremadeProfiles, getSuggestions } from '../BLs/audit';
import { AuditEventsQuery, AuditEventIdParam, SuggestionsQuery } from '../validators/audit';
import { PerformQuery } from '../utils/performQuery';

/**
 * Controller factor for audit events
 */
export const getAuditRoutes = (performQuery: PerformQuery) => {
    /**
     * Get paginated list of audit events with optional filters
     */
    const handleGetAuditEvents: RequestHandler = async (req, res): Promise<void> => {
        try {
            const userId = (req.headers['x-user-id'] as string) || 'group_admin';
            const params = req.query as unknown as AuditEventsQuery;
            const result: AuditEventPage = await getEvents(params, performQuery, userId);
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
     */
    const handleGetAuditEventById: RequestHandler = async (req, res): Promise<void> => {
        try {
            const { id } = req.params as unknown as AuditEventIdParam;
            const event: AuditEvent | null = await getEventById(id, performQuery);

            if (!event) {
                res.status(404).json({ error: 'Event not found' });
                return;
            }

            res.status(200).json(event);
        } catch (error) {
            console.error('Error in getAuditEventById:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    /**
     * Get all available premade profiles
     */
    const handleGetPremadeProfiles: RequestHandler = async (req, res): Promise<void> => {
        try {
            const profiles = await getPremadeProfiles(performQuery);
            res.status(200).json(profiles);
        } catch (error) {
            console.error('Error in getPremadeProfiles:', error);
            res.status(500).json([]);
        }
    };

    /**
     * Get autocomplete suggestions for general search
     */
    const handleGetSuggestions: RequestHandler = async (req, res): Promise<void> => {
        try {
            const { term } = req.query as unknown as SuggestionsQuery;
            const result = await getSuggestions({ term }, performQuery);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error in getSuggestions:', error);
            res.status(500).json([]);
        }
    };



    return {
        getAuditEvents: handleGetAuditEvents,
        getAuditEventById: handleGetAuditEventById,
        getPremadeProfiles: handleGetPremadeProfiles,
        getSuggestions: handleGetSuggestions,
    };
};




