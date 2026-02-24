/**
 * Parser utilities for transforming GraphQL responses for premade profiles to domain models
 */

import {
  GraphQLUserPremadeProfilesResponse,
  GraphQLProfileValuesResponse,
  GraphQLUserAllowedParametersResponse,
  PremadeProfile,
  ProfileParameterValue,
} from "./profileParser.types";

/**
 * Parse the premade profiles response
 */
export function parsePremadeProfilesResponse(
  response: GraphQLUserPremadeProfilesResponse,
): PremadeProfile[] {
  // Handle errors
  if (response.errors && response.errors.length > 0) {
    throw new Error(
      `GraphQL Errors: ${response.errors.map((e) => e.message).join(", ")}`,
    );
  }

  // Handle missing data
  if (!response.data || !response.data.allMiragePremadeProfileOwners) {
    return [];
  }

  return response.data.allMiragePremadeProfileOwners.nodes.map(
    (node) => node.miragePremadeProfileByProfileId,
  );
}

/**
 * Parse the profile values response to an array of { parameterId, valueId } objects
 */
export function parseProfileValuesResponse(
  response: GraphQLProfileValuesResponse,
): ProfileParameterValue[] {
  // Handle errors
  if (response.errors && response.errors.length > 0) {
    throw new Error(
      `GraphQL Errors: ${response.errors.map((e) => e.message).join(", ")}`,
    );
  }

  // Handle missing data
  if (
    !response.data ||
    !response.data.allMiragePremadeProfileDigitalParameterValues
  ) {
    return [];
  }

  return response.data.allMiragePremadeProfileDigitalParameterValues.nodes;
}

/**
 * Parse the user allowed digital parameter values response
 */
export function parseUserAllowedParametersResponse(
  response: GraphQLUserAllowedParametersResponse,
): ProfileParameterValue[] {
  // Handle errors
  if (response.errors && response.errors.length > 0) {
    throw new Error(
      `GraphQL Errors: ${response.errors.map((e) => e.message).join(", ")}`,
    );
  }

  // Handle missing data
  if (!response.data || !response.data.allMiragePremadeProfileOwners) {
    return [];
  }

  const { nodes } = response.data.allMiragePremadeProfileOwners;
  const allowedParams: ProfileParameterValue[] = [];

  nodes.forEach((ownerNode) => {
    const profileRequest = ownerNode.miragePremadeProfileByProfileId;
    if (
      profileRequest &&
      profileRequest.miragePremadeProfileDigitalParameterValuesByProfileId
    ) {
      const values =
        profileRequest.miragePremadeProfileDigitalParameterValuesByProfileId
          .nodes;
      allowedParams.push(...values);
    }
  });

  return allowedParams;
}
