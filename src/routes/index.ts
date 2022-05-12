import * as requestIp from 'request-ip';
import * as express from 'express';
import * as cors from "cors";
const router = express.Router();

router.use(cors({
    origin: '*'
}));
router.use(requestIp.mw());

router.get('/', (request: express.Request, response: express.Response) =>
    response
        .status(201)
        .redirect("https://carlos-eduardo-sanchez-torres.sanchezcarlosjr.com/curp-renapo-api")
);

import user from "../middlewares/user";
import {query} from "express-validator";
import {ApplicationError} from "../classes/error";
import * as curp from "../utils/curp";
import validationResult from "../middlewares/validator";
import {findMexicanByCURP} from "../controllers/CurpController";
router.use(user);
router.get(
    '/curp',
    query("curp")
        .exists()
        .withMessage(new ApplicationError('user', 'The query parameter --curp-- is missing.', 'Add the query parameter.'))
        .if(query("curp").exists())
        .toUpperCase()
        .custom((value) => {
            return curp.validFormat(value);
        })
        .withMessage(new ApplicationError('user', 'The query parameter --curp-- submitted has invalid characters.', 'Correct the curp entered.')),
    validationResult,
    findMexicanByCURP);


export default router;
