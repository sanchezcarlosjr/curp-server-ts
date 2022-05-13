import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

import { api, API } from "../models/api.mode.mongoose";

import { Report } from "../classes/report";
import { ApplicationError, ProcessInfo } from "../classes/error";
import { MongooseManager, MongoLocal } from "../classes/mongoose";

import { getTranslate, languagesSupported } from "../utils/translater";

export async function addRecordApi(req: Request, res: Response, next: NextFunction) {
  const id: Types.ObjectId = new Types.ObjectId();
  const e = new Error().stack?.split("\n") as string[];
  const info = new ProcessInfo(id.toString(), e, "Function", "Function", "-");

  return await MongooseManager.connection("accounts", id.toString(), e).then(async (answer) => {
    if (answer.status === "OK") {
      const prefabRecordApi = answer.details.model<API>("users", api);
      const docRecordApi = new prefabRecordApi({
        _id: id,
        api: req.originalUrl,
        method: req.method,
        date: { start: new Date() },
      });
      return await docRecordApi
        .save()
        .then(() => next())
        .catch((error: ErrorEvent) => {
          MongoLocal.updateStatus(false);
          info.error = error.message;
          info.furtherDetails = error ?? "We have not been able to obtain further details about the error.";
          const ticket = Report.generate("mongoose", info);
          return res.status(505).jsonp({
            error: [
              new ApplicationError(
                getTranslate(req.params.language as languagesSupported, { group: "general", msg: "server" }),
                getTranslate(req.params.language as languagesSupported, { group: "errors", msg: "dbCommunication" }),
                getTranslate(req.params.language as languagesSupported, { group: "solution", msg: "automaticallyTicket" })
              ),
            ],
            ticket
          });
        });
    } else if (answer.status === "RETRY") {
      return res.status(505).jsonp({
        error: [
          new ApplicationError(
            getTranslate(req.params.language as languagesSupported, { group: "general", msg: "server" }),
            getTranslate(req.params.language as languagesSupported, { group: "errors", msg: "dbCommunication" }),
            getTranslate(req.params.language as languagesSupported, { group: "solution", msg: "tryAgain" })
          ),
        ],
      });
    } else if (answer.status === "ERROR") {
      return res.status(505).jsonp({
        error: [
          new ApplicationError(
            getTranslate(req.params.language as languagesSupported, { group: "general", msg: "server" }),
            getTranslate(req.params.language as languagesSupported, { group: "errors", msg: "dbCommunication" }),
            getTranslate(req.params.language as languagesSupported, { group: "solution", msg: "automaticallyTicket" })
          ),
        ],
        ticket: answer.furtherDetails.ticket
      });
    } else {
      return res.status(505).jsonp({
        error: [
          new ApplicationError(
            getTranslate(req.params.language as languagesSupported, { group: "general", msg: "server" }),
            getTranslate(req.params.language as languagesSupported, { group: "errors", msg: "problemsAndOutages" }),
            getTranslate(req.params.language as languagesSupported, { group: "solution", msg: "keepAnEye" })
          ),
        ],
      });
    }
  });
}
