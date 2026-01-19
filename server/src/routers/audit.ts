import { Router } from 'express';
import { getAuditEvents, getAuditEventById, getPremadeProfiles, getSuggestions } from '../routes/audit';
import { validate } from '../middleware/validate';
import { auditEventsQuerySchema, auditEventIdParamSchema, suggestionsQuerySchema } from '../validators/audit';

const auditRouter = Router();

// GET /audit/events - List audit events with filters and pagination
// Apply query validation middleware
auditRouter.get('/events', validate(auditEventsQuerySchema, 'query'), getAuditEvents);

// GET /audit/premade-profiles - List available premade profiles
auditRouter.get('/premade-profiles', getPremadeProfiles);

// GET /audit/suggest - Get autocomplete suggestions
auditRouter.get('/suggest', validate(suggestionsQuerySchema, 'query'), getSuggestions);

// GET /audit/events/:id - Get single event by ID
// Apply params validation middleware
auditRouter.get('/events/:id', validate(auditEventIdParamSchema, 'params'), getAuditEventById);

export default auditRouter;
