import * as fs from "fs";

let newApp: boolean = true;
const defaultDirectories: string[] = [
  "src/data/reports/system/",
  "src/data/reports/mongoose/",
  "src/data/reports/firebase/",
  "src/data/reports/email/",
];

export class NewApp {
  private static createDefaultFolders(): void {
    defaultDirectories.forEach((element) => {
      if (!fs.existsSync(element)) fs.mkdirSync(element, { recursive: true });
      return;
    });
    return;
  }

  static run() {
    if (newApp) {
      this.createDefaultFolders();
      newApp = false;
      return;
    } else {
      return;
    }
  }
}
