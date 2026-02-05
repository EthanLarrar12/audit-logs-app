import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodObject, ZodError } from "zod";
import { InvalidParameterException } from "../../sdks/exceptions";

/**
 * Generic validation middleware factory
 * Validates request query, params, or body against a Zod schema
 */
export const validate = (
  schema: ZodObject<any, any>,
  source: "query" | "params" | "body" = "body",
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Validate the specified part of the request
      const validated = await schema.parseAsync(req[source]);

      // Replace the request data with validated data
      req[source] = validated;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Pass the error to the next middleware (which should be the error handler)
        next(new InvalidParameterException(error.message));
        return;
      }

      // Handle unexpected errors by passing them to next
      next(error);
    }
  };
};
