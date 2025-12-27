import { Router } from 'express';
import { getAuditEvents, getAuditEventById } from '../controllers/audit';
import { validate } from '../middleware/validate';
import { auditEventsQuerySchema, auditEventIdParamSchema } from '../validators/audit';

const auditRouter = Router();

// GET /audit/events - List audit events with filters and pagination
// Apply query validation middleware
auditRouter.get('/events', validate(auditEventsQuerySchema, 'query'), getAuditEvents);

// GET /audit/events/:id - Get single event by ID
// Apply params validation middleware
auditRouter.get('/events/:id', validate(auditEventIdParamSchema, 'params'), getAuditEventById);

export default auditRouter;
