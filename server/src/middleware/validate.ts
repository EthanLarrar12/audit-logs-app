import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodObject, ZodError } from 'zod';

/**
 * Generic validation middleware factory
 * Validates request query, params, or body against a Zod schema
 */
export const validate = (schema: ZodObject<any, any>, source: 'query' | 'params' | 'body' = 'body'): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Validate the specified part of the request
            const validated = await schema.parseAsync(req[source]);

            // Replace the request data with validated data
            req[source] = validated;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.message,
                });
                return;
            }

            // Handle unexpected errors
            res.status(500).json({
                error: 'Internal server error',
            });
        }
    };
};
