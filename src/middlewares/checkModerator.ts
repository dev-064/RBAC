import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../constants/responses';
import { CustomRequest } from '../types/requestType';
import prismadb from '../lib/prismadb';
export const SECRET_KEY: Secret = process.env.JWT_SECRET!;


export const checkModerator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
        (req as CustomRequest).token = decoded;

        // Check if user exists and role matches in database
        const user = await prismadb.user.findUnique({
            where: {
                id: decoded.id
            }
        });

        if (!user || (user.role === 'USER')) {
            UnauthorizedError(res, "UnauthorizedError", "Only moderators and administrators can access this resource");
            return;
        }

        // Verify token role matches database role
        if (user.role !== decoded.role) {
            UnauthorizedError(res, "UnauthorizedError", "Invalid authorization token");
            return;
        }

        next();
    } catch (err) {
        UnauthorizedError(res, "UnauthorizedError", "Only moderators and administrators can access this resource");
    }
};
