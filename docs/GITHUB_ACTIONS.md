# GitHub Actions Usage

Proof Bot can be used from GitHub Actions to post an evidence comment after a workflow completes.

## Example

```yaml
name: Proof Comment

on:
  workflow_dispatch:
    inputs:
      issue:
        description: GitHub issue URL
        required: true

permissions:
  contents: read
  issues: write

jobs:
  proof:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 22
      - run: npm ci
      - run: npm run build
      - name: Post proof comment
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          node dist/src/cli.js \
            --issue "${{ inputs.issue }}" \
            --commit "${{ github.sha }}" \
            --check "Workflow passed" \
            --link "${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}" \
            --comment
```

## Permission Notes

Use `issues: write` for issue comments. For pull requests from forks, be careful with token permissions and prefer dry-run output.
