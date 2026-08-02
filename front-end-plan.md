# Front-End Plan — Auth Screens (Sign In / Sign Up)

Design reference: `design-reference/login.png`. Reference is Lovable-generated
inspiration, not spec — some flows in it (see below) diverge from the actual
schema in `plan.md` and are intentionally not being built as shown.

## Scope decisions

- **No Apple/OAuth.** Mockup shows "Continue with Apple" — not building this yet.
- **No code-based coach invite.** Mockup's step 3 ("Got an invite code?") shows a
  coach generating a 6-character code the athlete enters. This is a different
  mechanism and direction than `plan.md`'s `coach_invites` table (athlete emails
  coach a token link, coach accepts). Not implementing either version of
  coach-linking UI in this pass — Lovable diverged from how the system is
  actually built.
- **No "Forgot password?" flow.** Not in `plan.md`, not building the backend for
  it now. Skip or leave inert in the UI.
- **Sign Up is a 2-step wizard**, not 3 — role selection, then details
  (full name / email / password). Invite-code step dropped per above.

## Shared foundations (build once, reuse across both screens)

- **`Logo` common component** — lime "M" badge + "MUSCLE MEMORY" wordmark.
  In progress at `client/src/components/common/Logo.tsx`.
- **Labeled input pattern** — uppercase, letter-spaced small label above each
  field, `<label htmlFor>` wired to a matching input `id`. Closes the
  techdebt.md item on missing `<label>` elements for both `LoginPage` and
  `SignupPage`.
- **Primary button style** — full-width, pill-shaped, `--color-positive`
  background, bold uppercase black text.
- **Font** — no `--font-*` tokens exist yet in `index.css`. Not picking real
  typography this pass; `uppercase tracking-widest text-xs` on the default
  font stack approximates the mockup's label style well enough.

## Sign In (`client/src/pages/LoginPage.tsx`)

- Centered, mobile-first column: headline ("Welcome back."), subcopy, labeled
  email/password inputs, primary button.
- Replace the mockup's Apple button/divider with a "Don't have an account?
  Sign up" link to `/signup`.
- Wire the currently-empty `catch` block to an error message shown above the
  button (closes part of the techdebt.md "no toast/error feedback" item for
  this page).
- Disable/loading-state the submit button while the request is in flight.

## Sign Up (`client/src/pages/SignupPage.tsx`) → 2-step wizard

- **Step 1 — role selection:** two large selectable cards (Athlete / Coach)
  replacing the current native radio buttons. Decide: real
  `<input type="radio">` under the hood (visually hidden, styled via label)
  for accessibility, vs. plain state + visual checkmark badge.
- **Step 2 — details:** full name, email, password fields (same labeled-input
  pattern as Sign In), back arrow to step 1.
- Progress bar: 2 segments (not the mockup's 3).
- While touching this component, also close two existing techdebt.md items:
  narrow `role` to `UserRole` instead of `string`, and add the same
  error-state pattern as Sign In on final submit.

## Desktop / web layout

Mockup is mobile frames only. Planned translation: full-bleed on small
viewports; above some breakpoint, constrain to a centered card
(~400–440px wide) rather than stretching full width — similar to how the
tablet coach screenshot centers content instead of going edge to edge.
Exact breakpoint TBD.

**Decision:** rather than each page (`LoginPage`, `SignupPage`) implementing
this responsive container independently, one general layout-route component
owns it — see MUS-53. Mirrors the existing `ProtectedRoute.tsx` pattern
(layout route + `<Outlet />`), wraps `/login` and `/signup`, and renders
`Logo` once at the top. Intentionally **one shared shell for now**, not split
into separate auth-vs-authenticated-app layouts — revisit that split once the
authenticated app's bottom-tab-nav chrome is built.

## Build order

1. `Logo` common component — done
2. General layout shell (MUS-53) — owns responsive container + renders `Logo`
3. Sign In (`LoginPage.tsx`) — MUS-52
4. Sign Up wizard (`SignupPage.tsx`) — MUS-52
