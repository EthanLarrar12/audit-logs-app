import { Request, Response, NextFunction, RequestHandler } from "express";
import { PerformQuery } from "./performQuery";

export const getApiKeyValidationMiddleware = (
  performQuery: PerformQuery,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    // For local development, simply forward the request as usual.
    // In the future, this will validate the API key using performQuery.
    next();
  };
};

export const getValidateRestrictedResourcesMiddleware = (
  restrictedResourceToValidate: RestrictedResources[],
  errorMessage: string,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    // For local development, simply forward the request as usual.
    // In the future, this will validate the API key using performQuery.
    next();
  };
};

export const SYSTEM_RESTRICTED_RESOURCES_KEY = "restricted_resources";

export enum RestrictedResources {
  DELETE_HISTORY = "DELETE_HISTORY",
}
