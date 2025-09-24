# GetMyGrapher – Frontend Milestone Implementation Plan

Purpose
- Translate PRD and system docs into an actionable, time-bound plan with concrete deliverables, acceptance criteria, and dependencies.
- Cover foundation, authentication/onboarding, discovery, jobs, availability, profiles, communication, community, and quality gates.

Scope and Assumptions
- Stack: React 19 + TypeScript, MUI v7, Emotion, Zustand, TanStack Query, React Router (declarative), Vite.
- Mobile-first with responsive breakpoints; accessibility to WCAG 2.1 AA.
- Real-time messaging will be phased: UI first, realtime infra later.

Indicative Timeline
- Duration: ~10–12 weeks total. Each milestone lists a target week (W#). Some can overlap if owners differ.

Milestone 0 – Project Foundation (W1)
Goals
- Establish routing, state, and data layer at the app shell level.
Deliverables
- Routing: Add React Router (declarative) and top-level route structure in main.tsx and App.
- Data layer: QueryClientProvider at root; error boundaries; loading fallbacks.
- State: Initialize appStore/onboardingStore patterns; persist partial onboarding drafts.
- Theming: Global theme tokens and dark-mode readiness.
- Tooling: ESLint/Prettier, TS strict, commit hooks, CI skeleton.
Acceptance Criteria
- App boots and routes render; basic navigation working; CI builds green.
Dependencies
- None.

Milestone 1 – Auth & Welcome (W1–W2)
Goals
- Implement welcome, auth choices, and Google OAuth with session handling.
Deliverables
- Components: WelcomeScreen.tsx, AuthenticationScreen.tsx (updated).
- Session: Token storage, refresh handling, protected routes guard, sign-out.
- Routing: Redirect to onboarding start post-auth.
Acceptance Criteria
- Login via Google and email/password; session persists across refresh; protected pages gated.
Dependencies
- Milestone 0.

Milestone 2 – Onboarding I: Category, Type, Location (W3)
Goals
- Build the first three onboarding steps with validation and progress.
Deliverables
- Components: CategorySelectionScreen.tsx, ProfessionalTypeSelectionScreen.tsx, LocationSetupScreen.tsx.
- UX: ProgressIndicator.tsx, StepNavigation.tsx, OnboardingLayout.tsx.
- Location: navigator.geolocation with manual override; radius selector; Indian city/state lists.
- State: Save/resume drafts; analytics events fired per step.
Acceptance Criteria
- Users can complete steps 1–3 with real-time validation and resume after refresh.
Dependencies
- Milestone 1.

Milestone 3 – Onboarding II: Profile, Details, Availability, Complete (W4–W5)
Goals
- Finish onboarding and land first-time user on home.
Deliverables
- Components: BasicProfileSetupScreen.tsx, ProfessionalDetailsScreen.tsx, AvailabilitySetupScreen.tsx, RegistrationCompleteScreen.tsx.
- Utilities: fileUploadUtils.ts (size/type checks), registrationValidation.ts, locationServices.ts, analyticsEvents.ts.
- Availability: default weekly template; booking preferences; visibility settings (basic UI).
- Analytics: registration_started, category_selected, registration_completed, etc.
Acceptance Criteria
- Full 6-step onboarding works end-to-end with validations and file uploads; funnel events captured.
Dependencies
- Milestones 1–2.

Milestone 4 – Homepage & Discovery (W5–W6)
Goals
- Implement discovery, search, and filtering per PRD.
Deliverables
- Components: EnhancedHomepage with search bar, quick actions, featured professionals, and filter drawer.
- Data: Hooks for featured and nearby professionals; list virtualization for performance.
- UX: Clear empty states, loading skeletons.
Acceptance Criteria
- Search and filters update results; performance acceptable on mobile.
Dependencies
- Milestones 0–3.

Milestone 5 – Job Posting System (W6–W7)
Goals
- Create multi-step job posting, discovery, and management flows.
Deliverables
- Components: JobCreationWizard, JobFeed, JobDetailModal, MyJobs (manage/edit).
- Validation: date/pincode/rate checks; draft save.
- Filtering/sort: relevance, distance, date posted.
Acceptance Criteria
- Users can create, view, edit, and browse jobs with validations.
Dependencies
- Milestones 0–4.

Milestone 6 – Profile Management & Profile View (W7)
Goals
- Enable professionals to manage and present profiles.
Deliverables
- Profile edit forms: equipment, pricing, portfolio links; photo upload; about section.
- Profile view system: public view, privacy controls.
- Store: appStore updates for profile completeness.
Acceptance Criteria
- Edits persist; public profile renders consistently; privacy toggles respected.
Dependencies
- Milestones 0–3; optional: 4 for discovery integration.

Milestone 7 – Availability Management (W7–W8)
Goals
- Calendar and recurring availability patterns with privacy settings.
Deliverables
- Calendar components; weekly template; blackout dates; simple conflicts handling.
- Preferences: lead time, advance booking window.
Acceptance Criteria
- Users manage availability; conflicts surfaced; preferences saved.
Dependencies
- Milestones 3 and 6.

Milestone 8 – In‑App Communication (Phase 1 UI) (W8–W9)
Goals
- Ship messaging UI and state; stub realtime providers for future upgrade.
Deliverables
- Components: Conversations list, message thread, composer (text/image), typing/presence placeholders.
- Store: communicationStore basics; optimistic UI for sending; retry on failure.
Acceptance Criteria
- Core chat flows work locally; UI shows message types; no hard dependency on realtime backend.
Dependencies
- Milestones 0, 4–6.

Milestone 9 – Community Posing Library (W9)
Goals
- Contribution and browsing with EXIF extraction integration.
Deliverables
- Components: PoseGrid, PoseDetailView, Upload flow with EXIF extraction (services/exifService.ts).
- Moderation cues; likes/saves interactions.
Acceptance Criteria
- Users upload, view details, and interact with poses; EXIF extraction validation paths handled.
Dependencies
- Milestones 0, 6.

Milestone 10 – Notifications & Preferences (W9–W10)
Goals
- Centralize notifications and user preferences UI.
Deliverables
- Notification center UI; per-channel preference toggles.
- Hook for enqueueing in-app notifications; basic batching/debounce.
Acceptance Criteria
- Users can view notifications and change preferences; settings persist.
Dependencies
- Milestones 4–9.

Milestone 11 – Security, Accessibility, Performance (W10–W11)
Goals
- Harden the app and meet quality bars.
Deliverables
- Security: input sanitization, file-type/size enforcement, CSRF tokens where applicable, rate-limit UX responses.
- Accessibility: keyboard nav, focus states, ARIA, color contrast fixes.
- Performance: code-splitting routes, image optimization, memoization, list virtualization audit.
Acceptance Criteria
- Passes security checklist; a11y spot checks; bundle and core vitals within targets.
Dependencies
- All prior milestones.

Milestone 12 – Testing, E2E, and Release (W11–W12)
Goals
- Stabilize and hand off.
Deliverables
- Unit tests for validation and stores; integration tests for flows; E2E for critical paths.
- Cross-browser/device smoke; regression test suite; release notes.
Acceptance Criteria
- Test coverage thresholds met; E2E happy paths green; no P1/P2 bugs open.
Dependencies
- All prior milestones.

Cross‑Cutting Artifacts (by location)
- src/components/onboarding: all onboarding screens + layout, progress, step nav.
- src/utils: registrationValidation.ts, onboardingFormatters.ts, fileUploadUtils.ts.
- src/services: locationServices.ts, exifService.ts (existing), supabaseClient.ts.
- src/store: appStore.ts, onboardingStore.ts, communicationStore.ts, availabilityStore.ts.
- src/App.*: feature shell screens; App.GetMyGrapher.tsx for top-level composition.
- main.tsx: router and providers.

Risks & Mitigations
- Realtime scope creep: ship UI first; isolate provider adapter to swap in later.
- Routing refactor impact: migrate behind feature flags; add route-level tests.
- Performance on low-end devices: early virtualization and code-splitting; image lazy-load.
- File uploads on poor networks: retries, size limits, and clear progress states.

Tracking & Reporting
- Weekly milestone reviews with demo builds.
- Dashboard of acceptance criteria and test status per milestone.
- Burn-down of open issues; risk log updated weekly.

Success Metrics
- Registration completion ≥ 70%; profile completion ≥ 85%.
- <10 min avg onboarding time; <5% error rate.
- Accessibility: WCAG 2.1 AA conformance on key flows.

Ownership (suggested)
- Foundation/Routing: Platform engineer
- Auth/Onboarding: Feature team A
- Discovery/Jobs: Feature team B
- Profiles/Availability: Feature team C
- Communication/Community: Feature team D
- QA/Tooling/Perf: Platform + QA