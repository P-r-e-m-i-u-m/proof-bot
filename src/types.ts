export interface GitHubIssueRef {
  owner: string;
  repo: string;
  number: number;
  kind: "issue" | "pull";
  url: string;
}

export interface ProofInput {
  issue: GitHubIssueRef;
  title?: string;
  summary?: string;
  commits: string[];
  checks: string[];
  files: string[];
  links: string[];
  risks: string[];
  nextSteps: string[];
  generatedAt: string;
}

export interface GitHubIssueSummary {
  title: string;
  state: string;
  url: string;
  labels: string[];
}

export interface CommentResult {
  posted: boolean;
  url?: string;
  body: string;
}
