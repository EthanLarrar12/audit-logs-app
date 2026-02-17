/**
 * Parser utilities for transforming GraphQL responses for premade profiles to domain models
 */

interface GraphQLPremadeProfileNode {
  id: string;
  name: string;
}

interface GraphQLUserPremadeProfilesResponse {
  data?: {
    allMirageUserPremadeProfiles?: {
      nodes: Array<{
        miragePremadeProfileByProfileId: {
          id: string;
          name: string;
        };
      }>;
    };
  };
  errors?: Array<{ message: string }>;
}

interface GraphQLProfileValueNode {
  parameterId: string;
  valueId: string;
}

interface GraphQLProfileValuesResponse {
  data?: {
    allMiragePremadeProfileDigitalParameterValues?: {
      nodes: GraphQLProfileValueNode[];
    };
  };
  errors?: Array<{ message: string }>;
}

/**
 * Parse the premade profiles response
 */
export function parsePremadeProfilesResponse(
  response: GraphQLUserPremadeProfilesResponse,
): { id: string; name: string }[] {
  // Handle errors
  if (response.errors && response.errors.length > 0) {
    throw new Error(
      `GraphQL Errors: ${response.errors.map((e) => e.message).join(", ")}`,
    );
  }

  // Handle missing data
  if (!response.data || !response.data.allMirageUserPremadeProfiles) {
    return [];
  }

  return response.data.allMirageUserPremadeProfiles.nodes.map(
    (node) => node.miragePremadeProfileByProfileId,
  );
}

/**
 * Parse the profile values response to an array of { parameterId, valueId } objects
 */
export function parseProfileValuesResponse(
  response: GraphQLProfileValuesResponse,
): { parameterId: string; valueId: string }[] {
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

interface GraphQLUserAllowedParametersResponse {
  data?: {
    allMirageUserPremadeProfiles?: {
      nodes: Array<{
        miragePremadeProfileByProfileId?: {
          miragePremadeProfileDigitalParameterValuesByProfileId?: {
            nodes: Array<{
              parameterId: string;
              valueId: string;
            }>;
          };
        };
      }>;
    };
  };
  errors?: Array<{ message: string }>;
}

/**
 * Parse the user allowed digital parameter values response
 */
export function parseUserAllowedParametersResponse(
  response: GraphQLUserAllowedParametersResponse,
): { parameterId: string; valueId: string }[] {
  // Handle errors
  if (response.errors && response.errors.length > 0) {
    throw new Error(
      `GraphQL Errors: ${response.errors.map((e) => e.message).join(", ")}`,
    );
  }

  // Handle missing data
  if (!response.data || !response.data.allMirageUserPremadeProfiles) {
    return [];
  }

  const { nodes } = response.data.allMirageUserPremadeProfiles;
  const allowedParams: { parameterId: string; valueId: string }[] = [];

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
