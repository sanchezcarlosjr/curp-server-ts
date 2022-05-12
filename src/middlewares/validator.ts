import * as express from "express";
import { validationResult } from 'express-validator';

export default async function (req: express.Request, res: express.Response, next: express.NextFunction) {
  const err = validationResult(req);
  if (!validationResult(req).isEmpty()) {
    let errors: any[] = [];
    err.array().forEach(v => errors.push(v.msg))
    return res.status(400).jsonp({ 'error': errors})
  }
  return next();
}
