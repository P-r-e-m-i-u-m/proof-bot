# LinkedIn Launch Post

Most GitHub issues end with:

“done”

But in real engineering work, “done” is not enough.

What changed?
How was it verified?
Which files moved?
Did CI pass?
What risks are still open?
What should happen next?

So I built **Proof Bot**.

It is a TypeScript CLI that generates evidence-backed proof-of-work comments for GitHub issues and pull requests.

Instead of closing an issue with a vague update, Proof Bot creates a clean comment with:

- implementation commits
- verification checks
- changed files
- supporting links
- risks and follow-up
- next steps

It supports dry-run mode, GitHub issue comment mode, issue metadata fetching, tests, CI, and a release workflow.

I also used Proof Bot on its own issue, so the repo demonstrates the workflow publicly.

Repo: https://github.com/P-r-e-m-i-u-m/proof-bot

Would love feedback from people who care about GitHub hygiene, open-source maintenance, CI workflows, or developer tooling.

#OpenSource #GitHub #DeveloperTools #TypeScript #SoftwareEngineering #DevOps #GitHubActions #BuildInPublic #CLI #Automation #ProofOfWork
