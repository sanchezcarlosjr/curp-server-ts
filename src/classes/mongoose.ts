import * as express from "express";
import mongoose from "mongoose";

import { Report } from "./report";
import { ProcessInfo } from "./error";

function Protect(target: any): void {
  Object.freeze(target);
  Object.preventExtensions(target);
}

type MongoResponse =
  | { status: "OK"; details: mongoose.Connection }
  | { status: "ERROR"; details: string, moreDetails: any | string };

let MongoLocalStatus: Boolean = false;
let currentConnections: { [key: string]: mongoose.Connection } = {};

const _file = "";

@Protect
export abstract class MongooseManager {
  static async connection(database: string, req: express.Request): Promise<mongoose.Connection | Boolean> {
    const info = new ProcessInfo(req.idApi, _file, "MongooseManager.connection()");
    if (MongoLocal.getStatus()) {
      const result = await this.getConnection(database);
      if (result.status === "OK") {
        return result.details;
      } else {
        MongoLocal.updateStatus();
        info.error = result.details;
        info.moreDetails = result.moreDetails ?? "err://no-err";
        Report.generate("mongoose", info);
        return new Promise((resolve) => resolve(true));
      }
    } else {
      return new Promise((resolve) => resolve(false));
    }
  }

  private static async getConnection(dbName: string): Promise<MongoResponse> {
    try {
      if (currentConnections[dbName] !== undefined) {
        return { status: "OK", details: currentConnections[dbName] };
      } else {
        const connection = await mongoose
          .createConnection((process.env.MONGODB_CNN as string) + "?retryWrites=true&w=majority")
          .asPromise();
        return { status: "OK", details: connection };
      }
    } catch (error: any) {
      return { status: "ERROR", details: error.message ?? "mongoose: createConnection()", moreDetails: error};
    }
  }
}

@Protect
class MongoLocal {
  static getStatus(status = MongoLocalStatus): Boolean {
    return status;
  }

  static updateStatus(status = MongoLocalStatus): void {
    MongoLocalStatus = !status;
    return;
  }
}
