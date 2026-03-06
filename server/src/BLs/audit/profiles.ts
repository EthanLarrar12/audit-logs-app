import { PerformQuery } from "../../../sdks/performQuery";
import {
  GET_USER_PREMADE_PROFILES_QUERY,
  GET_ALL_PREMADE_PROFILES_QUERY
} from "../../GQL/profileQueries";
import { GET_SEARCH_FILTERS_QUERY } from "../../GQL/auditQueries";
import { parseSearchFiltersResponse } from "../../parsers/auditParser";
import {
  parsePremadeProfilesResponse as parseProfiles,
  parseAllPremadeProfilesResponse
} from "../../parsers/profileParser";
import {
  GraphQLUserPremadeProfilesResponse,
  GraphQLAllPremadeProfilesResponse,
  PremadeProfile,
} from "../../parsers/profileParser.types";
import { isPermitted } from "../../../sdks/STS";

/**
 * Get all premade profiles for a specific user, or all profiles if user has update permission
 */
export const getPremadeProfiles = async (
  performQuery: PerformQuery,
  userId: string,
): Promise<PremadeProfile[]> => {
  const canUpdateParams = isPermitted({ profilePermission: ["update"] });

  if (canUpdateParams) {
    const result = (await performQuery(GET_ALL_PREMADE_PROFILES_QUERY)) as GraphQLAllPremadeProfilesResponse;
    return parseAllPremadeProfilesResponse(result);
  }

  const result = (await performQuery(GET_USER_PREMADE_PROFILES_QUERY, {
    userId,
  })) as GraphQLUserPremadeProfilesResponse;

  return parseProfiles(result);
};

/**
 * Get unique suggestions for autocomplete based on a search term
 * (Moved from BLs/audit.ts)
 */
export const getSuggestions = async (
  params: { term: string; page?: number; limit?: number },
  performQuery: PerformQuery,
): Promise<unknown[]> => {
  const page = params.page || 1;
  const limit = params.limit || 50;
  const offset = (page - 1) * limit;

  const result = await performQuery(GET_SEARCH_FILTERS_QUERY, {
    searchValue: params.term,
    resultLimit: limit,
    resultOffset: offset,
  });

  // reusing existing parser from auditParser (need to verify export)
  return parseSearchFiltersResponse(result as Record<string, unknown>);
};
