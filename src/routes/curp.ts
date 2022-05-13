import express = require("express");
import { param, query } from "express-validator";
const router = express.Router();

import user from "../middlewares/user";
import validationResult from "../middlewares/validator";

import * as curp from "../utils/curp";
import { getTranslate, languagesSupported } from "../utils/translater";

import { ApplicationError } from "../classes/error";

import { findMexicanByCURP } from "../controllers/CurpController";

//* MIDDLEWARES
router.use(user);

//* RUTAS
router.get(
  "/:language/information",
  param("language")
    .isIn(languagesSupported)
    .withMessage(
      (value) =>
        new ApplicationError(
          getTranslate("default", { group: "general", msg: "user" }),
          getTranslate("default", { group: "errors", msg: "languageNotSupported" }),
          getTranslate("default", { group: "solution", msg: "languagesSupported" })
        )
    ),
  validationResult,
  query("curp")
    .exists()
    .withMessage(
      (value, { req, location, path }) =>
        new ApplicationError(
          getTranslate(req.params?.language, { group: "general", msg: "user" }),
          getTranslate(req.params?.language, { group: "errors", msg: "queryStringMissing" }, [
            { code: "#{value}#", value: path },
          ]),
          getTranslate(req.params?.language, { group: "solution", msg: "addQueryString" }, [
            { code: "#{value}#", value: path },
          ])
        )
    )
    .if(query("curp").exists())
    .isLength({ min: 18, max: 18 })
    .withMessage(
      (value, { req, location, path }) =>
        new ApplicationError(
          getTranslate(req.params?.language, { group: "general", msg: "user" }),
          getTranslate(req.params?.language, { group: "errors", msg: "queryStringLength" }, [
            { code: "#{value}#", value: path },
            { code: "#{length}#", value: value.length },
          ]),
          getTranslate(
            req.params?.language,
            { group: "solution", msg: "specificLengthQueryString" },
            [
              { code: "#{value}#", value: path },
              { code: "#{length}#", value: "18" },
            ]
          )
        )
    )
    .if(query("curp").isLength({ min: 18, max: 18 }))
    .toUpperCase()
    .custom((value) => {
      if (curp.validFormat(value)) return true;
      return false;
    })
    .withMessage(
      (value, { req, location, path }) =>
        new ApplicationError(
          getTranslate(req.params?.language, { group: "general", msg: "user" }),
          getTranslate(req.params?.language, { group: "errors", msg: "patternCURPInvalid" }),
          getTranslate(req.params?.language, { group: "solution", msg: "moreInformation" }, [
            {
              code: "#{value}#",
              value:
                "https://www.gob.mx/segob%7Crenapo/es/articulos/sabes-como-se-conforma-tu-curp?idiom=es",
            },
          ])
        )
    ),
  validationResult,
  findMexicanByCURP,
);

export default router;