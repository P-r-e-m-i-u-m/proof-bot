# Security Policy

Proof Bot can post comments to GitHub issues and pull requests. Treat tokens carefully.

## Token Guidance

- Use the least-privileged token possible.
- Prefer `GITHUB_TOKEN` inside GitHub Actions.
- Do not paste tokens into issues, pull requests, logs, screenshots, or examples.
- Use `--dry-run` before `--comment` when testing a new workflow.

## Reporting

Please open a minimal issue without secrets if you find a security-sensitive behavior.
