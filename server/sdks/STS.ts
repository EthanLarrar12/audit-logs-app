import { Request, Response, NextFunction } from 'express';

export const getSTSMiddleware = () => (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookieName = 'sts_token';

        // Check if cookie exists using cookie-parser
        if (!req.cookies || !req.cookies[cookieName]) {
            // Generate a simple random token
            const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

            // Set cookie if it doesn't exist
            res.cookie(cookieName, token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });
        }

        next();
    } catch (error) {
        console.error('Error in STS middleware:', error);
        next();
    }
};


export const getUserIdFromCookie = (): string => {
    return 'user_001';
};

export type Permissions = {
    [key: string]: string[];
}

export const isPermitted = (permissions: Permissions) => {

    if (permissions?.mandatPermissions?.includes("read")) {
        return true;
    }
    // return false;

    return true;
}