import mongoose from "mongoose";

import { Report } from "./report";
import { ProcessInfo } from "./error";

function Protect(target: any): void {
  Object.freeze(target);
  Object.preventExtensions(target);
}

type MongoFinalResponse =
  | { status: "OK"; details: mongoose.Connection }
  | { status: "RETRY" | "ERROR" | "DOWN"; details: string; furtherDetails: any };
type MongoPartialResponse =
  | { status: "OK"; details: mongoose.Connection }
  | { status: "STANDBY"; details: mongoose.Connection }
  | { status: "ERROR"; details: string; furtherDetails: any | string };

let MongoLocalStatus: boolean = true;
let currentConnections: { [key: string]: mongoose.Connection } = {};

@Protect
export class MongooseManager {
  static async connection(database: string, id: string, parent: string | string[]): Promise<MongoFinalResponse> {
    const info = new ProcessInfo(
      id,
      new Error().stack?.split("\n") as string[],
      "Class",
      new MongooseManager().constructor.name,
      parent
    );
    if (MongoLocal.getStatus()) {
      const result = await this.getConnection(database); // Position: 1
      if (result.status === "OK") {
        return {
          status: "OK",
          details: result.details,
        };
      } else if (result.status === "STANDBY") {
        return await this.pingDatabase(database).then((answer) => {
          if (answer.status === "OK") {
            return {
              status: "OK",
              details: result.details,
            };
          } else if (answer.status === "RETRY") {
            return {
              status: "RETRY",
              details: answer.details,
              furtherDetails: answer.furtherDetails,
            };
          } else {
            info.position = 2.1; // Position: 2.1
            MongoLocal.updateStatus(false);
            info.error = answer.details;
            info.furtherDetails = answer.furtherDetails;
            Report.generate("mongoose", info);
            return {
              status: "ERROR",
              details: answer.details,
              furtherDetails: answer.furtherDetails,
            };
          }
        });
      } else {
        info.position = 2.2; // Position: 2.2
        MongoLocal.updateStatus(false);
        info.error = result.details;
        info.furtherDetails = result.furtherDetails ?? "We have not been able to obtain further details about the error.";
        const ticket = Report.generate("mongoose", info);
        return {
          status: "ERROR",
          details: info.error,
          furtherDetails: { further: info.furtherDetails, ticket },
        };
      }
    } else {
      return {
        status: "DOWN",
        details: "The connection to the database is deactivated.",
        furtherDetails: "Enable database connection when maintenance, repair, installation, etc. is completed.",
      };
    }
  }

  private static async getConnection(database: string): Promise<MongoPartialResponse> {
    try {
      if (currentConnections[database] !== undefined) {
        return { status: "STANDBY", details: currentConnections[database] };
      } else {
        currentConnections[database] = await mongoose
          .createConnection((process.env.MONGODB_CNN as string) + database + "?retryWrites=true&w=majority")
          .asPromise();
        return { status: "OK", details: currentConnections[database] };
      }
    } catch (error: any) {
      return {
        status: "ERROR",
        details: error.message ?? "mongoose: createConnection()",
        furtherDetails: error ?? "We have not been able to obtain further details about the error.",
      };
    }
  }

  private static async pingDatabase(database: string) {
    return currentConnections[database].db
      .admin()
      .ping()
      .then((result) => {
        if (result?.ok === 1)
          return {
            status: "OK",
            details: "The connection to the database is correct.",
            furtherDetails: ":)",
          };
        delete currentConnections[database];
        return {
          status: "RETRY",
          details: "The connection to the database has problems. Please try again.",
          furtherDetails: result?.ok ?? "We have not been able to obtain further details about the error.",
        };
      })
      .catch((error) => {
        return {
          status: "ERROR",
          details: error.message ?? "We have not been able to obtain details of the error.",
          furtherDetails: error ?? "We have not been able to obtain further details about the error.",
        };
      });
  }

  static async consoleReport(): Promise<void> {
    try {
      const connection = await mongoose
        .createConnection((process.env.MONGODB_CNN as string) + "default" + "?retryWrites=true&w=majority")
        .asPromise();
      const adminUtil = connection.db.admin();
      const result = await adminUtil.ping();
      console.log(result);
      await connection.close();
    } catch (error: any) {
      console.log(error);
    }
  }

  static async closeConnections(connections: string[] | undefined) {
    if (connections === undefined) {
      const allConnections = Object.keys(currentConnections);
      for await (const iterator of allConnections) {
        await currentConnections[iterator].close();
        delete currentConnections[iterator];
      }
    } else {
      for await (const iterator of connections) {
        if (currentConnections[iterator] !== undefined) {
          await currentConnections[iterator].close();
          delete currentConnections[iterator];
        }
        return;
      }
    }
  }
}

@Protect
export class MongoLocal {
  static getStatus(status = MongoLocalStatus): boolean {
    return status;
  }

  static updateStatus(status: boolean): void {
    MongoLocalStatus = status;
    return;
  }
}
