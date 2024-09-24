// imports
import { verify } from 'jsonwebtoken';
import { DecodedToken } from '../interfaces/decoded-token.interface';
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

// middleware 
export const userAuth = (req: Request, res: Response, next: NextFunction): Response | void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({
            success: 0,
            message: 'Access denied...'
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: 0,
            message: 'Invalid token...'
        });
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        req.body.user = decoded.user;
        next();
    } catch (err) {
        const error = err as Error;
        console.log(error);

        return res.status(500).json({
            success: 0,
            error: error.message
        });
    } 
}