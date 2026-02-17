/**
 * GraphQL queries for premade profiles
 */

/**
 * Query to fetch all premade profiles
 */
/**
 * Query to fetch all premade profiles for a specific user
 */
export const GET_USER_PREMADE_PROFILES_QUERY = `
    query UserPremadeProfiles($userId: String!) {
        allMiragePremadeProfileOwners(condition: { userId: $userId }) {
            nodes {
                miragePremadeProfileByProfileId {
                    id
                    name
                }
            }
        }
    }
`;

/**
 * Fragment to fetch digital parameter values for a specific premade profile
 */
export const PROFILE_VALUES_FRAGMENT = `
    allMiragePremadeProfileDigitalParameterValues(condition: $condition) {
        nodes {
            parameterId
            valueId
        }
    }
`;

/**
 * Query to fetch digital parameter values for a specific premade profile
 */
export const GET_PROFILE_VALUES_QUERY = `
    query ProfileValues($condition: MiragePremadeProfileDigitalParameterValueCondition) {
        ${PROFILE_VALUES_FRAGMENT}
    }
`;

/**
 * Fragment to fetch all allowed parameters for a user
 */
export const USER_ALLOWED_PARAMETERS_FRAGMENT = `
    allMiragePremadeProfileOwners(condition: { userId: $userId }) {
        nodes {
            miragePremadeProfileByProfileId {
                miragePremadeProfileDigitalParameterValuesByProfileId {
                    nodes {
                        parameterId
                        valueId
                    }
                }
            }
        }
    }
`;

/**
 * Query to fetch all allowed parameters for a user
 */
export const GET_USER_ALLOWED_PARAMETERS_QUERY = `
    query UserAllowedParameters($userId: String!) {
        ${USER_ALLOWED_PARAMETERS_FRAGMENT}
    }
`;
