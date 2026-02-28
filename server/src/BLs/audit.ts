import { AuditEvent, AuditEventPage, AuditQueryParams } from "../types/audit";
import { TranslationRequestValues, TranslationDictionary } from "../shared/types/audit";
import {
  GET_AUDIT_EVENTS_QUERY,
  GET_AUDIT_EVENT_BY_ID_QUERY,
  DELETE_AUDIT_HISTORY_MUTATION,
  getTranslationsQuery,
} from "../GQL/auditQueries";
import {
  parseAuditEventsResponse,
  parseAuditEventByIdResponse,
} from "../parsers/auditParser";
import { PerformQuery } from "../../sdks/performQuery";
import { BadGatewayException } from "../../sdks/exceptions";
import { buildAuditFilters } from "./audit/filters";
import {
  getPremadeProfiles as getPremadeProfilesFromBL,
  getSuggestions as getSuggestionsFromBL,
} from "./audit/profiles";
import { MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE } from "../shared/auditConstants";

/**
 * Business logic layer for audit events
 * Handles data access via PostGraphile GraphQL
 */

/**
 * Get paginated and filtered audit events
 */
export const getEvents = async (
  params: AuditQueryParams,
  performQuery: PerformQuery,
  userId: string,
): Promise<AuditEventPage> => {
  // 1. Construct Filter Object using new modular logic
  const filters = await buildAuditFilters(params, performQuery, userId);

  // 2. Pagination & Sorting
  const rawPageSize = Number(params.pageSize) || DEFAULT_PAGE_SIZE;
  const first = rawPageSize > MAX_PAGE_SIZE ? MAX_PAGE_SIZE : rawPageSize;
  const offset = ((params.page || 1) - 1) * first;

  let orderBy = "INSERT_TIME_DESC";
  if (params.sort) {
    const direction = params.order === "asc" ? "ASC" : "DESC";
    switch (params.sort) {
      case "created_at":
        orderBy = `INSERT_TIME_${direction}`;
        break;
      case "action":
        orderBy = `MIDUR_ACTION_${direction}`;
        break;
      case "actor_username":
        orderBy = `EXECUTOR_ID_${direction}`;
        break;
      case "target_name":
        orderBy = `TARGET_ID_${direction}`;
        break;
      default:
        orderBy = `INSERT_TIME_${direction}`;
    }
  }

  // 3. Execute GraphQL Query
  const variables: Record<string, unknown> = {
    first,
    offset,
    orderBy: [orderBy],
  };

  if (Object.keys(filters).length > 0) {
    variables.filter = filters;
  }

  const result = await performQuery(GET_AUDIT_EVENTS_QUERY, variables);

  // 4. Parse and return response
  return parseAuditEventsResponse(
    result as Record<string, unknown>,
    params.page || 1,
  );
};

/**
 * Get single audit event by ID
 */
export const getEventById = async (
  id: string,
  performQuery: PerformQuery,
): Promise<AuditEvent | null> => {
  const result = await performQuery(GET_AUDIT_EVENT_BY_ID_QUERY, { id });

  return parseAuditEventByIdResponse(result as Record<string, unknown>);
};

/**
 * Get all premade profiles (Delegated)
 */
export const getPremadeProfiles = async (
  performQuery: PerformQuery,
  userId: string,
): Promise<{ id: string; name: string }[]> => {
  return getPremadeProfilesFromBL(performQuery, userId);
};

/**
 * Get unique suggestions for autocomplete (Delegated)
 */
export const getSuggestions = async (
  params: { term: string; page?: number; limit?: number },
  performQuery: PerformQuery,
): Promise<unknown[]> => {
  return getSuggestionsFromBL(params, performQuery);
};

/**
 * Delete history records by time range
 */
export const deleteAuditHistory = async (
  performQuery: PerformQuery,
  startDate?: number,
  endDate?: number,
): Promise<number> => {
  const result = (await performQuery(DELETE_AUDIT_HISTORY_MUTATION, {
    startDate: startDate ? new Date(startDate).toISOString() : null,
    endDate: endDate ? new Date(endDate).toISOString() : null,
  })) as {
    errors?: Array<{ message: string }>;
    data?: { deleteAuditHistory?: { integer?: number } };
  };

  if (result.errors) {
    throw new BadGatewayException(result.errors[0].message);
  }

  return result.data?.deleteAuditHistory?.integer || 0;
};

/**
 * Get display translations for specific parameters and values
 */
export const getTranslations = async (
  performQuery: PerformQuery,
  paramIds: string[],
  valuesToTranslate: TranslationRequestValues
): Promise<TranslationDictionary> => {
  const queryStr = getTranslationsQuery(valuesToTranslate);
  const queryVariables = { paramIds };

  const rawResult = await performQuery(queryStr, queryVariables);

  type GraphQLTranslationResponse = {
    data?: {
      allDigitalParameters?: { nodes: { id: string; name: string }[] };
      allDigitalValues?: { nodes: { id: string; digitalParameterId: string; name: string }[] };
    };
  };

  const typedResult = rawResult as GraphQLTranslationResponse;

  const parametersData = typedResult.data?.allDigitalParameters;
  const parametersNodes = parametersData?.nodes;

  const parametersDict: Record<string, string> = {};

  if (parametersNodes) {
    parametersNodes.forEach((node: { id: string; name: string }) => {
      const parameterId = node.id;
      const parameterName = node.name;

      parametersDict[parameterId] = parameterName;
    });
  }

  const valuesData = typedResult.data?.allDigitalValues;
  const valuesNodes = valuesData?.nodes;
  const hasValues = Boolean(valuesNodes);

  const valuesDict: Record<string, Record<string, string>> = {};

  if (valuesNodes) {
    valuesNodes.forEach((node: { id: string; digitalParameterId: string; name: string }) => {
      const parameterId = node.digitalParameterId;
      const valueId = node.id;
      const valueName = node.name;

      const isParameterInitialized = Boolean(valuesDict[parameterId]);
      if (!isParameterInitialized) {
        valuesDict[parameterId] = {};
      }

      valuesDict[parameterId][valueId] = valueName;
    });
  }

  const translationsDictionary: TranslationDictionary = {
    parameters: parametersDict,
    values: valuesDict
  };

  return translationsDictionary;
};
