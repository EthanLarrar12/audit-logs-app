/**
 * Domain models for premade profiles
 */

export interface PremadeProfile {
  id: string;
  name: string;
}

export interface ProfileParameterValue {
  parameterId: string;
  valueId: string;
}

/**
 * GraphQL response shapes for premade profiles
 */

export interface GraphQLPremadeProfileNode {
  id: string;
  name: string;
}

export interface GraphQLProfileOwnerNode {
  miragePremadeProfileByProfileId: GraphQLPremadeProfileNode;
}

export interface GraphQLUserPremadeProfilesResponse {
  data?: {
    allMiragePremadeProfileOwners?: {
      nodes: GraphQLProfileOwnerNode[];
    };
  };
  errors?: GraphQLError[];
}

export interface GraphQLProfileValueNode {
  parameterId: string;
  valueId: string;
}

export interface GraphQLProfileValuesResponse {
  data?: {
    allMiragePremadeProfileDigitalParameterValues?: {
      nodes: GraphQLProfileValueNode[];
    };
  };
  errors?: GraphQLError[];
}

export interface GraphQLProfileDigitalParameterValues {
  nodes: GraphQLProfileValueNode[];
}

export interface GraphQLProfileWithParameterValues {
  miragePremadeProfileDigitalParameterValuesByProfileId?: GraphQLProfileDigitalParameterValues;
}

export interface GraphQLAllowedParameterOwnerNode {
  miragePremadeProfileByProfileId?: GraphQLProfileWithParameterValues;
}

export interface GraphQLUserAllowedParametersResponse {
  data?: {
    allMiragePremadeProfileOwners?: {
      nodes: GraphQLAllowedParameterOwnerNode[];
    };
  };
  errors?: GraphQLError[];
}

export interface GraphQLError {
  message: string;
}
