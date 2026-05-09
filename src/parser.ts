import type { GitHubIssueRef } from "./types.js";

const issueUrlPattern = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/(issues|pull)\/(\d+)\/?$/;

export function parseGitHubIssueUrl(url: string): GitHubIssueRef {
  const match = url.match(issueUrlPattern);
  if (!match) {
    throw new Error("Expected a GitHub issue or pull request URL.");
  }

  return {
    owner: match[1],
    repo: match[2],
    kind: match[3] === "pull" ? "pull" : "issue",
    number: Number(match[4]),
    url
  };
}

export function parseCsv(value?: string): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
