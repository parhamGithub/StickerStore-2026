import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
    userName?: string;
}
export declare function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void;
