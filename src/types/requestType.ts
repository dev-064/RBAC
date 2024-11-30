import { Request } from 'express';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}