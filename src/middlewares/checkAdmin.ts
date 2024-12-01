import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../constants/responses';
import { CustomRequest } from '../types/requestType';
import prismadb from '../lib/prismadb';

export const SECRET_KEY: Secret = process.env.JWT_SECRET!;


export const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
        (req as CustomRequest).token = decoded;

        // Check if user exists and is admin in database
        const user = await prismadb.user.findUnique({
            where: {
                id: decoded.id
            }
        });

        if (!user || user.role !== 'ADMIN') {
            UnauthorizedError(res, "UnauthorizedError", "Only administrators can access this resource");
            return;
        }

        next();
    } catch (err) {
        UnauthorizedError(res, "UnauthorizedError", "Only administrators can access this resource");
    }
};