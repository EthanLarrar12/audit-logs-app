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
        allMirageUserPremadeProfiles(condition: { userId: $userId }) {
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
 * Query to fetch digital parameter values for a specific premade profile
 */
export const GET_PROFILE_VALUES_QUERY = `
    query ProfileValues($condition: MiragePremadeProfileDigitalParameterValueCondition) {
        allMiragePremadeProfileDigitalParameterValues(condition: $condition) {
            nodes {
                parameterId
                valueId
            }
        }
    }
`;

/**
 * Query to fetch all allowed parameters for a user
 */
export const GET_USER_ALLOWED_PARAMETERS_QUERY = `
    query UserAllowedParameters($userId: String!) {
        allMirageUserPremadeProfiles(condition: { userId: $userId }) {
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
    }
`;
