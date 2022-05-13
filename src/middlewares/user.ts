import * as express from 'express';
import {getAuth} from 'firebase-admin/auth';
import { ApplicationError } from '../classes/error';

async function ensureIsAValidApiKey(request: express.Request, response: express.Response, next: express.NextFunction) {
    const apiKey: string = request.query.apiKey as string;
    if (!apiKey) {
        return response
            .status(400)
            .jsonp({'error': [new ApplicationError('user', 'API key not found.', 'Add the API key to the request header.')]});
    }
    try {
        await getAuth().getUser(apiKey);
    } catch (error: any) {
        response.status(401).jsonp({ 'error': error.message });
        return;
    }
    next();
    return;
}

// Add the translate function
async function getAPIRecord(req: express.Request, res: express.Response, next: express.NextFunction) {
    const apiKey: string = req.headers.apikey as string;
    if (!apiKey) return res.status(400).jsonp({ 'error': [new ApplicationError('user', 'API key not found.', 'Add the API key to the request header.')] });

    return await getAuth().getUser(apiKey).then((user) => {
        if (user.disabled) {
            return res.status(403)
                .jsonp({
                    'error': [new ApplicationError('user', 'Your API Key is disabled.', 'For more information, please contact customer service.')]
                });
        }
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
            return res.status(403).jsonp({'error': [new ApplicationError('user', 'Invalid API key.', 'Check that the API key is correct.')]});
        }
        return res.status(403).jsonp({'error': [new ApplicationError('server', error.message, 'For more information, please contact customer service.')]});
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