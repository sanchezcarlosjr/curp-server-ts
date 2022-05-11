import express = require('express');
import { query } from 'express-validator';
const router = express.Router();

import user from '../middlewares/user';
import validationResult from '../middlewares/validator';

import * as curp from '../utils/curp';

import { _error } from '../classes/error';

//* MIDDLEWARES
router.use(user);

//* RUTAS
router
  .get(
    '/curp',
    query("curp")
      .exists()
      .withMessage(new _error('user', 'The query parameter --curp-- is missing.', 'Add the query parameter.'))
      .if(query("curp").exists())
      .toUpperCase()
      .custom((value) => {
        if (curp.validFormat(value)) return true;
        return false;
      })
      .withMessage(new _error('user', 'The query parameter --curp-- submitted has invalid characters.', 'Correct the curp entered.')),
      validationResult,
    (req: express.Request, res: express.Response) => {
      const ip = req.clientIp;
      return res.status(201).jsonp(ip);
    });

export default router;