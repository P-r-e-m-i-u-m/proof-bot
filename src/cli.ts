import { GitHubClient } from "./github.js";
import { parseCsv, parseGitHubIssueUrl } from "./parser.js";
import { renderProofMarkdown } from "./renderer.js";
import type { ProofInput } from "./types.js";

interface CliOptions {
  issue?: string;
  title?: string;
  summary?: string;
  commits: string[];
  checks: string[];
  files: string[];
  links: string[];
  risks: string[];
  nextSteps: string[];
  dryRun: boolean;
  fetchIssue: boolean;
  comment: boolean;
  help: boolean;
}

const options = parseArgs(process.argv.slice(2));

if (options.help || !options.issue) {
  printHelp();
  process.exit(options.help ? 0 : 1);
}

const issue = parseGitHubIssueUrl(options.issue);
const client = new GitHubClient();
const proofInput: ProofInput = {
  issue,
  title: options.title,
  summary: options.summary,
  commits: options.commits,
  checks: options.checks,
  files: options.files,
  links: options.links,
  risks: options.risks,
  nextSteps: options.nextSteps,
  generatedAt: new Date().toISOString()
};

const issueSummary = options.fetchIssue ? await client.getIssue(issue) : undefined;
const body = renderProofMarkdown(proofInput, issueSummary);

if (options.comment && !options.dryRun) {
  const result = await client.postComment(issue, body);
  console.log(`Posted proof comment: ${result.url}`);
} else {
  console.log(body);
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    commits: [],
    checks: [],
    files: [],
    links: [],
    risks: [],
    nextSteps: [],
    dryRun: false,
    fetchIssue: false,
    comment: false,
    help: false
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--issue") {
      options.issue = requireValue(arg, next);
      index += 1;
    } else if (arg === "--title") {
      options.title = requireValue(arg, next);
      index += 1;
    } else if (arg === "--summary") {
      options.summary = requireValue(arg, next);
      index += 1;
    } else if (arg === "--commit") {
      options.commits.push(requireValue(arg, next));
      index += 1;
    } else if (arg === "--check") {
      options.checks.push(requireValue(arg, next));
      index += 1;
    } else if (arg === "--file") {
      options.files.push(requireValue(arg, next));
      index += 1;
    } else if (arg === "--link") {
      options.links.push(requireValue(arg, next));
      index += 1;
    } else if (arg === "--risk") {
      options.risks.push(requireValue(arg, next));
      index += 1;
    } else if (arg === "--next") {
      options.nextSteps.push(requireValue(arg, next));
      index += 1;
    } else if (arg === "--commits") {
      options.commits.push(...parseCsv(requireValue(arg, next)));
      index += 1;
    } else if (arg === "--files") {
      options.files.push(...parseCsv(requireValue(arg, next)));
      index += 1;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--fetch-issue") {
      options.fetchIssue = true;
    } else if (arg === "--comment") {
      options.comment = true;
      options.fetchIssue = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function requireValue(flag: string, value?: string): string {
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a value.`);
  }
  return value;
}

function printHelp(): void {
  console.log(`Proof Bot

Generate evidence-backed proof-of-work comments for GitHub issues and pull requests.

Usage:
  proof-bot --issue <url> [options]

Options:
  --issue <url>       GitHub issue or pull request URL
  --title <text>      Comment heading
  --summary <text>    Short explanation of the work
  --commit <sha>      Commit evidence. Repeatable
  --check <text>      Verification evidence. Repeatable
  --file <path>       Changed file. Repeatable
  --link <url>        Supporting link. Repeatable
  --risk <text>       Risk or limitation. Repeatable
  --next <text>       Follow-up item. Repeatable
  --commits <csv>     Comma-separated commits
  --files <csv>       Comma-separated files
  --fetch-issue       Fetch issue title and state from GitHub
  --comment           Post the generated proof as a GitHub issue comment
  --dry-run           Print markdown instead of posting
  --help              Show this help

Examples:
  proof-bot --issue https://github.com/owner/repo/issues/1 --commit abc123 --check "npm test passed" --dry-run
  proof-bot --issue https://github.com/owner/repo/pull/2 --comment
`);
}
