/**
 * GraphQL queries for premade profiles
 */

/**
 * Query to fetch all premade profiles
 */
export const GET_PREMADE_PROFILES_QUERY = `
    query PremadeProfiles {
        allMiragePremadeProfiles(orderBy: NAME_ASC) {
            nodes {
                id
                name
            }
        }
    }
`;

/**
 * Query to fetch digital parameter values for a specific premade profile
 */
export const GET_PROFILE_VALUES_QUERY = `
    query ProfileValues($condition: MiragePremadeProfileDigitalParameterValueCondition) {
        allMiragePremadeProfileDigitalParameterValues(condition: $condition) {
            nodes {
                valueId
            }
        }
    }
`;
