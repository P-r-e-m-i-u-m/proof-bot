# Proof Bot Workflow

Proof Bot creates a repeatable habit: every issue or pull request can end with evidence, not just "done".

## Recommended Flow

1. Open an issue with a clear goal.
2. Implement the change in a commit or pull request.
3. Run local verification.
4. Wait for CI.
5. Run Proof Bot in dry-run mode.
6. Post the proof comment when the evidence looks right.

## Dry Run

```bash
proof-bot \
  --issue https://github.com/owner/repo/issues/1 \
  --commit abc1234 \
  --check "npm test passed" \
  --check "GitHub Actions passed" \
  --dry-run
```

## Comment Mode

```bash
GITHUB_TOKEN=... proof-bot \
  --issue https://github.com/owner/repo/issues/1 \
  --commit abc1234 \
  --check "npm test passed" \
  --comment
```

## Why This Matters

Good engineering work is easier to trust when the evidence is visible:

- implementation commits
- verification commands
- CI links
- changed files
- risks and follow-up

Proof Bot makes that evidence consistent.
