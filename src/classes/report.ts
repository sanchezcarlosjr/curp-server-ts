import * as fs from "fs";

type data = {
  id: string;
  file: string;
  type: string;
  process: string;
  position: number;
  error: string;
  furtherDetails: any;
  parent: string;
};
type folders = "system" | "mongoose" | "firebase" | "email";
type reportResponse = { date: Number; type: folders };

export class Report {
  static generate(folder: folders, data: data): reportResponse {
    const date = Date.now();
    fs.writeFileSync(`src/data/reports/${folder}/date${date}id${data.id}.json`, JSON.stringify(data));
    return { date, type: folder };
  }

  private static exist(date: Number, id: string, type: folders) {
    return fs.existsSync(`src/data/reports/${type}/date${date}id${id}.json`)
  }

  static get(date: Number, id: string, type: folders): Buffer | null {
    if (this.exist(date, id, type)) {
      const data = fs.readFileSync(`src/data/reports/${type}/date${date}id${id}.json`);
      return data;
    } else {
      return null;
    }
  }

  // Subir ticket
}
