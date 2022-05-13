import * as requestIp from "request-ip";
import * as express from "express";

import * as cors from "cors";

import home from './home';
import curp from './curp';

const router = express.Router();

router.use(
  cors({
    origin: "*",
  })
);
router.use(requestIp.mw());

router.use(home);
router.use("/curp", curp);

export default router;
