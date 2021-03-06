export class ApplicationError {
  'by': string;
  'problem': string;
  'solution': string;
  constructor(by: "user" | "server", problem: string, solution: string) {
    this.by = by;
    this.problem = problem;
    this.solution = solution;
  }
}
