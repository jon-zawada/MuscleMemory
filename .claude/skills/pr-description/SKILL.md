---
name: pr-description
description: In this repo, use when the user asks for "a PR description" of their working changes. Fills out .github/PULL_REQUEST_TEMPLATE.md from the actual diff — never invents a PR from memory or from what was merely discussed in conversation.
---

Fill out `.github/PULL_REQUEST_TEMPLATE.md` for the current work, based only on
real diff content.

## Which diff to use

Default to the current branch's changes against `main` (`git diff main...HEAD`,
plus `git status` for anything uncommitted). If the user already narrowed the
scope in this conversation (e.g. "staged changes," "my last commit"), use that
scope instead — don't silently widen it back to the whole branch.

## Filling out the template

Read `.github/PULL_REQUEST_TEMPLATE.md` fresh each time in case it changes.
As of writing it has three sections:

- **📋 Description** — what changed and why, in prose or short bullets.
  Ground every line in something actually present in the diff. If a file was
  discussed earlier in the conversation but isn't in the diff, it doesn't go
  in the description.
- **🧪 How to Test** — manual, functional verification steps only. **Do not
  include generic project-wide checks** like `npm run lint`, `npx tsc --noEmit`,
  or running the test suite — those are assumed/CI-covered, not what this
  section is for. Each bullet should be something a human does by hand:
  visiting a route, resizing a viewport, clicking a flow, checking a specific
  rendered result, a screen-reader spot-check for a11y-relevant changes, etc.
- **📸 Screenshots (if UI change)** — leave as a prompt/placeholder for the
  user to fill in (`<!-- paste before/after here -->`) rather than fabricating
  or describing what a screenshot would show. Only include this section's
  content requirement if the diff actually touches UI.

## Other conventions to apply

- If the diff maps cleanly to an open GitHub issue (e.g. branch name or an
  issue created earlier in this conversation), add `Closes #N` — but only
  when actually confident of the mapping, never guess an issue number.
- Never run `gh pr create` or `gh pr merge` as part of this skill — only
  produce the filled-out template text for the user to review. Creating or
  merging the PR requires the user to explicitly ask separately, per standing
  instructions.
