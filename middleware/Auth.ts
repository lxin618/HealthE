import type { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv';
import { AccessTokenPayload } from "../utility/TokenUtility";

dotenv.config();
const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY as string;
declare global {
    namespace Express {
        export interface Request {
            customer?: AccessTokenPayload
        }
    }
 }

export const Auth  = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.json({
            'error': true,
            'response': 'Invalid auth'
        })
    }
    try {
        const payload = jwt.verify(token.split(' ')[1], ACCESS_TOKEN_KEY) as AccessTokenPayload
        req.customer = payload
        next()
    }
    catch(e) {
        return res.json({
            'error': true,
            'response': 'Invalid signature'
        })
    }
}