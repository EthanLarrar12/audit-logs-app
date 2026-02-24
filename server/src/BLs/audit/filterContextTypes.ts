export interface GraphQLError {
  message: string;
}

export interface ProfileValueNode {
  parameterId: string;
  valueId: string;
}

export interface FilterContextData {
  allowedParams?: {
    nodes: Array<{
      miragePremadeProfileByProfileId?: {
        miragePremadeProfileDigitalParameterValuesByProfileId?: {
          nodes: ProfileValueNode[];
        };
      };
    }>;
  };
  premadeProfileValues?: {
    nodes: ProfileValueNode[];
  };
}
