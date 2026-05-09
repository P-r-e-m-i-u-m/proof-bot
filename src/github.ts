import type { CommentResult, GitHubIssueRef, GitHubIssueSummary } from "./types.js";

interface GitHubClientOptions {
  token?: string;
  fetchImpl?: typeof fetch;
}

export class GitHubClient {
  private readonly token?: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: GitHubClientOptions = {}) {
    this.token = options.token ?? process.env.GITHUB_TOKEN;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async getIssue(ref: GitHubIssueRef): Promise<GitHubIssueSummary> {
    const data = await this.request<Record<string, unknown>>(
      `https://api.github.com/repos/${ref.owner}/${ref.repo}/issues/${ref.number}`
    );

    return {
      title: String(data.title ?? ""),
      state: String(data.state ?? "unknown"),
      url: String(data.html_url ?? ref.url),
      labels: Array.isArray(data.labels)
        ? data.labels.map((label) => String((label as { name?: string }).name ?? "")).filter(Boolean)
        : []
    };
  }

  async postComment(ref: GitHubIssueRef, body: string): Promise<CommentResult> {
    const data = await this.request<Record<string, unknown>>(
      `https://api.github.com/repos/${ref.owner}/${ref.repo}/issues/${ref.number}/comments`,
      {
        method: "POST",
        body: JSON.stringify({ body })
      }
    );

    return {
      posted: true,
      url: String(data.html_url ?? ""),
      body
    };
  }

  private async request<T>(url: string, init: RequestInit = {}): Promise<T> {
    if (!this.token) {
      throw new Error("GITHUB_TOKEN is required for GitHub API requests.");
    }

    const response = await this.fetchImpl(url, {
      ...init,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        "User-Agent": "proof-bot",
        ...init.headers
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  }
}
