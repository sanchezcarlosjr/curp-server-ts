import * as express from 'express';
import { getAuth } from 'firebase-admin/auth';

import { _error } from '../classes/error';

export const ensureIsValidApiKey = async function (request: express.Request, res: express.Response, next: express.NextFunction) {
    const apiKey: string = request.query.apiKey as string;
    if (!apiKey) {
        res.status(401).jsonp({ 'error': 'invalid api key' });
        return;
    }
    try {
        await getAuth().getUser(apiKey);
    } catch (error: any) {
        res.status(401).jsonp({ 'error': error.message });
        return;
    }
    next();
}

// Add the translate function
async function getAPIRecord(req: express.Request, res: express.Response, next: express.NextFunction) {
    const apiKey: string = req.headers.apikey as string;
    if (!apiKey) return res.status(400).jsonp({ 'error': [new _error('user', 'API key not found.', 'Add the API key to the request header.')] });

    return await getAuth().getUser(apiKey).then((user) => {
        if (user.disabled) return res.status(403).jsonp({ 'error': [new _error('user', 'Your API Key is disabled.', 'For more information, please contact customer service.')] });
        req.user = {
            uid: user.uid,
            email: user.email ?? 'err://user/missing-email',
            emailVerified: user.emailVerified,
            displayName: user.displayName ?? 'err://user/missing-display-name',
            phoneNumber: user.phoneNumber ?? 'err://user/missing-phone-number',
        };
        return next();
    }).catch((error: any) => {
        if (error.code === 'auth/user-not-found') {
            return res.status(403).jsonp({ 'error': [new _error('user', 'Invalid API key.', 'Check that the API key is correct.')] });
        } else {
            return res.status(403).jsonp({ 'error': [new _error('server', error.message, 'For more information, please contact customer service.')] });
        }
    });
}

function test(req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log(req.headers['user-agent'])
    return next();
}

export default async function userMiddlwares(req: express.Request, res: express.Response, next: express.NextFunction) {
    await getAPIRecord(req, res, next);
    return test(req, res, next);
}