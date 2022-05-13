export class _error {
  'by': string;
  'problem': string;
  'solution': string;
  constructor(by: string, problem: string, solution: string) {
    this.by = by;
    this.problem = problem;
    this.solution = solution;
  }
}

export class processInfo {
  id: string;
  file: string;
  nameProcess: string;
  position: number;
  error: string;
  moreDetails: any;
  constructor(id: string, file: string, nameProcess: string) {
    this.id = id;
    this.file = file;
    this.nameProcess = nameProcess;
    this.position = 1;
    this.error = "err://no-err";
    this.moreDetails = "err://no-more-details";
  }
}

new processInfo("", "", "").error = "asdasdasd"