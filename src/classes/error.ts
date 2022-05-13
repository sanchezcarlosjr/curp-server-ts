export class ApplicationError {
  "by": string;
  "problem": string;
  "solution": string;
  constructor(by: string, problem: string, solution: string) {
    this.by = by;
    this.problem = problem;
    this.solution = solution;
  }
}

export class ProcessInfo {
  id: string;
  file: string;
  type: string;
  process: string;
  position: number;
  error: string;
  furtherDetails: any;
  parent: string;
  constructor(
    id: string,
    file: string | string[],
    type: "Class" | "Function",
    process: string,
    parent: string | string[]
  ) {
    this.id = id;
    if (typeof file === "string") {
      this.file = file;
    } else {
      let filePath = file[1];
      filePath = filePath.slice(filePath.lastIndexOf("(") + 1, filePath.lastIndexOf(")"));
      const extension = filePath.search(new RegExp(/[:][\d]+[:][\d]/g));
      this.file = filePath.slice(0, extension);
    }
    this.type = type;
    let functionName = file[1];
    functionName = functionName.slice(functionName.indexOf(".") + 1, functionName.indexOf("(") - 1) + "()";
    this.process = process + ": " + functionName;
    this.position = 1;
    this.error = "err://no-err";
    this.furtherDetails = "err://no-more-details";
    if (typeof parent === "string") {
      this.parent = parent;
    } else {
      let parentName = parent[1];
      parentName = parentName.slice(parentName.indexOf(".") + 1, parentName.indexOf("(") - 1) + "()";
      this.parent = parentName;
    }
  }
}
