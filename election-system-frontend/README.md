# University Election Management System — Frontend

React + TypeScript (Vite) client with a corporate sidebar layout, covering all three phases against the backend API.

## Setup

```bash
npm install
copy .env.example .env    # Windows; use `cp` on macOS/Linux — points at the backend, defaults to http://localhost:4000
npm run dev                # http://localhost:5173
```

The backend (`election-system/`) must be running for anything beyond the static pages to work.

## Layout

A fixed sidebar (Form Submission, Candidate Data, Registration Counter, Secretary Counter, plus staff login/logout) sits to the left; pages render to the right. Nav items are shown/hidden based on the logged-in user's role.

## Pages

| Route                     | Phase | Access                                 | What it does |
|---------------------------|-------|------------------------------------------|--------------|
| `/register`                 | 1     | Public                                   | Choice screen: General Seat or Faculty Seat. |
| `/register/general`         | 1     | Public                                   | General Seat nomination form. Shows the assigned reference number on success. |
| `/register/faculty`         | 1     | Public                                   | Faculty Seat nomination form (same fields, tagged `category: FACULTY`). |
| `/login`                    | —     | Public                                   | Staff sign-in. |
| `/candidates`                | 2     | SYSTEM_UNIT, DOCUMENTATION_UNIT           | Tabs for General/Faculty seat. Search by reference number, filter by faculty/college, preview table (ref. no., name, IC, matric), click **Edit** to open the edit modal. |
| `/counter/registration`      | 3a    | REGISTRATION_PIC                          | Search by reference number → full record (candidate, proposer, seconder, photo) → upload photo → "Mark as Hadir". |
| `/counter/secretary`         | 3b    | SECRETARY_PIC                             | Search by reference number → full record incl. photo → toggle deposit/eligibility → save. Blocked until Hadir is set. |

## Structure

```
src/
  api/client.ts              — fetch wrapper, injects JWT, throws ApiError on non-2xx
  context/AuthContext.tsx    — login/logout state, persisted to localStorage
  components/
    SideNav.tsx               — role-aware sidebar navigation
    ProtectedRoute.tsx         — role-gated routing
    NominationForm.tsx         — shared Phase 1 form (used by both General and Faculty pages)
    CandidateDetail.tsx        — shared read-only record view (photo, core info, proposer, seconder, status) used by both counters
    CandidateEditModal.tsx     — Phase 2 edit modal
  pages/                      — one file per screen
  constants/options.ts        — dummy Faculty / Residential College dropdown options (placeholder — swap for the real lists)
  types/index.ts               — shared types mirroring the backend's Prisma models
```

## Notes

- Reference numbers are plain, zero-padded numbers (`001`, `002`, ...) — no prefix.
- Faculty and Residential College are dropdowns backed by placeholder values (`Faculty Abc`, `College Abc`, etc.) in `src/constants/options.ts`. Replace with the real lists — or fetch them from a backend endpoint — when you're ready.
- Auth token + user are kept in `localStorage` (`election_token`, `election_user`).
- The counter pages don't navigate away after each action, so a PIC can process candidate after candidate without losing their place during a live event.
