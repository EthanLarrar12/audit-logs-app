import { Router } from "express";
import { getAuditRoutes } from "../routes/audit";
import { validate } from "../middleware/validate";
import {
  auditEventsQuerySchema,
  auditEventIdParamSchema,
  suggestionsQuerySchema,
  deleteHistorySchema,
} from "../validators/audit";
import { PerformQuery } from "../../sdks/performQuery";
import {
  getApiKeyValidationMiddleware,
  getValidateRestrictedResourcesMiddleware,
  RestrictedResources,
} from "../../sdks/apiSdk";

export const createAuditRouter = (performQuery: PerformQuery) => {
  const auditRouter = Router();
  const {
    getAuditEvents,
    getAuditEventById,
    getPremadeProfiles,
    getSuggestions,
    deleteAuditHistory,
  } = getAuditRoutes(performQuery);

  // GET /audit/events - List audit events with filters and pagination
  auditRouter.get(
    "/events",
    validate(auditEventsQuerySchema, "query"),
    getAuditEvents,
  );

  // GET /audit/premade-profiles - List available premade profiles
  auditRouter.get("/premade-profiles", getPremadeProfiles);

  // GET /audit/suggest - Get autocomplete suggestions
  auditRouter.get(
    "/suggest",
    validate(suggestionsQuerySchema, "query"),
    getSuggestions,
  );

  // GET /audit/events/:id - Get single event by ID
  auditRouter.get(
    "/events/:id",
    validate(auditEventIdParamSchema, "params"),
    getAuditEventById,
  );

  // DELETE /audit - Delete history records
  auditRouter.delete(
    "/",
    validate(deleteHistorySchema, "body"),
    getApiKeyValidationMiddleware(performQuery),
    getValidateRestrictedResourcesMiddleware(
      [RestrictedResources.DELETE_HISTORY],
      "Requesting system is not authorized to delete history records",
    ),
    deleteAuditHistory,
  );

  return auditRouter;
};
