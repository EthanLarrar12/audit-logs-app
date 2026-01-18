/**
 * Parser utilities for transforming GraphQL responses for premade profiles to domain models
 */

interface GraphQLPremadeProfileNode {
    id: string;
    name: string;
}

interface GraphQLPremadeProfilesResponse {
    data?: {
        allMiragePremadeProfiles?: {
            nodes: GraphQLPremadeProfileNode[];
        };
    };
    errors?: Array<{ message: string }>;
}

interface GraphQLProfileValueNode {
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
    response: GraphQLPremadeProfilesResponse
): { id: string; name: string }[] {
    // Handle errors
    if (response.errors && response.errors.length > 0) {
        throw new Error(`GraphQL Errors: ${response.errors.map(e => e.message).join(', ')}`);
    }

    // Handle missing data
    if (!response.data || !response.data.allMiragePremadeProfiles) {
        return [];
    }

    return response.data.allMiragePremadeProfiles.nodes;
}

/**
 * Parse the profile values response to a simple array of value IDs
 */
export function parseProfileValuesResponse(
    response: GraphQLProfileValuesResponse
): string[] {
    // Handle errors
    if (response.errors && response.errors.length > 0) {
        throw new Error(`GraphQL Errors: ${response.errors.map(e => e.message).join(', ')}`);
    }

    // Handle missing data
    if (!response.data || !response.data.allMiragePremadeProfileDigitalParameterValues) {
        return [];
    }

    return response.data.allMiragePremadeProfileDigitalParameterValues.nodes.map(node => node.valueId);
}
