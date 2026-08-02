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

## Verify against the issue

Before writing the description, identify the GitHub issue this PR solves —
usually the branch name matches the `MUS-##` numbering (e.g. branch `MUS-53`
→ issue #53), otherwise check what was discussed/created earlier in the
conversation. Run `gh issue view <N>` and actually read its body/scope.

Compare the issue's stated requirements against what's in the diff:

- If everything in the issue is covered, add `Closes #N` and move on.
- If something in the issue is missing from the diff, say so explicitly
  before producing the description — don't silently write `Closes #N` on a
  PR that doesn't fully close it, and don't silently drop the gap either.
  Ask whether the missing piece is out of scope for this PR (in which case
  it needs its own follow-up issue, same as prior scope-narrowing decisions
  in this repo) or whether it should be finished before the description is
  written.
- Never guess an issue number if the mapping isn't actually clear.

## Other conventions to apply

- Never run `gh pr create` or `gh pr merge` as part of this skill — only
  produce the filled-out template text for the user to review. Creating or
  merging the PR requires the user to explicitly ask separately, per standing
  instructions.
