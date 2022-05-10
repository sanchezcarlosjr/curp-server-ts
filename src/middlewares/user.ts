import * as express from 'express';
import { getAuth } from 'firebase-admin/auth';

export const ensureIsValidApiKey = async function (request: express.Request, res: express.Response, next: express.NextFunction) {
    const apiKey: string = request.query.apiKey as string;
    if (!apiKey) {
        res.status(401).jsonp({'error': 'invalid api key'});
        return;
    }
    try {
        await getAuth().getUser(apiKey);
    } catch (error: any) {
        res.status(401).jsonp({'error': error.message});
        return;
    }
    next();
}