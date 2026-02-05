import { RequestHandler } from "express";
import { AuditEvent, AuditEventPage } from "../types/audit";
import {
  getEvents,
  getEventById,
  getPremadeProfiles,
  getSuggestions,
  deleteAuditHistory,
} from "../BLs/audit";
import {
  AuditEventsQuery,
  AuditEventIdParam,
  SuggestionsQuery,
  DeleteHistoryBody,
} from "../validators/audit";

import { PerformQuery } from "../../sdks/performQuery";
import { NotFoundException } from "../../sdks/exceptions";
import { StatusCodes } from "http-status-codes";

/**
 * Controller factor for audit events
 */
export const getAuditRoutes = (performQuery: PerformQuery) => {
  /**
   * Get paginated list of audit events with optional filters
   */
  const handleGetAuditEvents: RequestHandler = async (
    req,
    res,
    next,
  ): Promise<void> => {
    try {
      const userId = (req.headers["x-user-id"] as string) || "group_admin";
      const params = req.query as unknown as AuditEventsQuery;
      const result: AuditEventPage = await getEvents(
        params,
        performQuery,
        userId,
      );
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get single audit event by ID
   */
  const handleGetAuditEventById: RequestHandler = async (
    req,
    res,
    next,
  ): Promise<void> => {
    try {
      const { id } = req.params as unknown as AuditEventIdParam;
      const event: AuditEvent | null = await getEventById(id, performQuery);

      if (!event) {
        throw new NotFoundException();
      }

      res.status(StatusCodes.OK).json(event);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all available premade profiles
   */
  const handleGetPremadeProfiles: RequestHandler = async (
    req,
    res,
    next,
  ): Promise<void> => {
    try {
      const profiles = await getPremadeProfiles(performQuery);
      res.status(StatusCodes.OK).json(profiles);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get autocomplete suggestions for general search
   */
  const handleGetSuggestions: RequestHandler = async (
    req,
    res,
    next,
  ): Promise<void> => {
    try {
      const { term } = req.query as unknown as SuggestionsQuery;
      const result = await getSuggestions({ term }, performQuery);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete history records by time range
   */
  const handleDeleteHistory: RequestHandler = async (
    req,
    res,
    next,
  ): Promise<void> => {
    try {
      const { startDate, endDate } = req.body as DeleteHistoryBody;
      const deletedCount = await deleteAuditHistory(
        performQuery,
        startDate,
        endDate,
      );

      res.status(StatusCodes.OK).json({
        success: true,
        message: `Deleted ${deletedCount} records`,
        deletedCount,
      });
    } catch (error) {
      next(error);
    }
  };

  return {
    getAuditEvents: handleGetAuditEvents,
    getAuditEventById: handleGetAuditEventById,
    getPremadeProfiles: handleGetPremadeProfiles,
    getSuggestions: handleGetSuggestions,
    deleteAuditHistory: handleDeleteHistory,
  };
};
