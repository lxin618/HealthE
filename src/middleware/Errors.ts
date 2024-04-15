import { Request, Response, NextFunction } from 'express';

export const Errors = (err: Error, req: Request, res: Response, next: NextFunction) => {
    res.send(400).json(err.message)
}