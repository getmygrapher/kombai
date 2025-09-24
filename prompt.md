Goal

Finish the Availability Management feature per AVAILABILITY_MANAGEMENT_TASKS.md and Availability_Management_System_Flow.md.
Add a proper /availability route group with nested screens.
Ensure UI consistency with the MUI v7 theme and improve accessibility.
Wire existing hooks to the central availabilityService (mocked).
Add the remaining MVP components as lightweight, testable stubs integrated into routes and existing managers.
Scope and constraints

Do not remove existing components; reuse and integrate them.
Keep providers and app shell intact.
Use React Router v7.
Use MUI v7 theme tokens only. No hardcoded colors.
Keep services mocked; no live backend calls.
Update routing

In main app router (main.tsx and src/App.GetMyGrapher.tsx):
Add a route group under /availability with:
/availability → redirect to /availability/calendar
/availability/calendar → calendar view (can reuse existing CalendarPage or render the calendar tab of AvailabilityManagement)
/availability/manage → AvailabilityManager (orchestration of calendar, quick actions, bulk editor, slot selector)
/availability/patterns → RecurringPatternManager (and wire to wizard/preview/exceptions)
/availability/privacy → privacy dashboard (see components below)
Ensure unauthenticated users are redirected to onboarding/welcome (consistent with existing guards).
Bottom navigation:
Update the “Calendar” tab to navigate to /availability/calendar (instead of /calendar).
Hook and service integration

Update src/hooks/useAvailability.ts to use src/services/availabilityService.ts instead of mockQuery.
Queries to use: getAvailability, getRecurringPatterns, getBookingConflicts, getAvailabilityStats, getPrivacySettings.
Mutations to use: updateAvailability, saveRecurringPattern, applyPattern, updatePrivacySettings, handleBookingConflict.
Keep TanStack Query and invalidate appropriate keys on success.
UI consistency (theme tokens, no hardcoded colors)

In src/components/availability/AvailabilityCalendar.tsx and CalendarLegend.tsx:
Replace all hardcoded hex colors with theme palette tokens:
Available → palette.success.{light/main/dark} as appropriate
Partially available → palette.warning
Booked → palette.info
Unavailable → palette.error
Neutral/past → palette.grey
Use theme.spacing, theme.shape.borderRadius, and theme.shadows consistently.
Typography via theme.typography variants only.
Ensure disabled states and loading use MUI states and accessible aria-disabled/aria-busy.
Accessibility improvements (calendar)

Add proper roles to the calendar grid: role="grid" for the grid, role="row" for weeks, role="gridcell" or button semantics for date cells.
Provide aria-labels for date cells (e.g., “15 January 2025, Available”).
Add visible focus rings (using theme focus styles).
Keyboard navigation:
Arrow keys to move focus by day.
PageUp/PageDown to change month (or Ctrl+Arrow if simpler).
Enter/Space to select a date.
Shift+Arrow to extend range selection (desktop).
Ensure tab order is logical.
Add missing components (lightweight MVP stubs that integrate into the routes/managers)

Create in src/components/availability/:
PatternWizard.tsx: stepper UI (Type → Weekly schedule → Date range → Exceptions → Review). On complete, call saveRecurringPattern and show success Snackbar.
PatternPreview.tsx: visualize effect of a pattern for a given date range; allow cancel/apply; on apply, call applyPattern.
PatternExceptions.tsx: manage exception dates for a pattern (add/remove, optional notes).
BookingAvailabilityBridge.tsx: listens to “bookings” from the service (mock), updates store to set slots tentative/confirmed/cancelled; optimistic updates with snackbars.
BookingConflictResolver.tsx: list conflicts from service, provide actions (auto-decline, manual review, flexible booking, waitlist stub); call handleBookingConflict and update store.
AvailabilityBookingStatus.tsx: small summary/status chips for booked vs available counts in the current view.
BookingCalendarOverlay.tsx: overlay badges/chips on the calendar cells indicating booked/tentative counts; ties into legend.
AvailabilityPrivacyDashboard.tsx: overview cards for visibilityLevel, showPartialAvailability, allowBookingRequests, allowedUsers count, stub access log/recommendations; uses store and service.
VisibilityPreview.tsx: toggle to preview how others see the calendar (public vs network vs contacts vs private); visually dim hidden elements.
AccessControlManager.tsx: manage allowed users (add/remove as stub); persists to store and service (mock).
CalendarExport.tsx: dialog with Export options (ICS/CSV) using service.exportCalendar (mock); Pro-only disabled states are okay.
CalendarImport.tsx: dialog to upload file and preview imported entries using service.importCalendar (mock).
CalendarSync.tsx: stub UI for external sync with a disabled toggle and helper text (“coming soon”).
Wire these as follows:
RecurringPatternManager should be able to open PatternWizard, PatternPreview, and PatternExceptions (use dialogs or inline panels).
/availability/privacy route should render AvailabilityPrivacyDashboard and include controls and links to VisibilityPreview and AccessControlManager.
Calendar overlay components (AvailabilityBookingStatus, BookingCalendarOverlay) should integrate with AvailabilityCalendar or AvailabilityManager, controlled by a simple “show bookings” toggle.
Calendar interactions and validation

Multi-select dates:
Support click to select/deselect.
Desktop: drag to select ranges.
Mobile: tap-to-extend (tap again to extend selection).
TimeSlotSelector upgrades:
Respect operating hours (06:00–23:00).
Granularity options: 1h default; 30m (Pro stub), 2h, 4h.
Presets (morning/afternoon/evening) and custom ranges.
Use validators from src/utils/availabilityValidation.ts to block overlaps, enforce min/max durations, and respect lead times.
After applying availability updates, clear selection and show a success Snackbar; on validation errors, show inline helper text.
State/store

Keep and reuse src/store/availabilityStore.ts. No breaking changes to its shape.
Ensure new components use the store actions correctly (setSelectedDates, setCurrentViewDate, setViewMode, setRecurringPatterns, setBookings, setConflicts, updatePrivacySettings, etc.).
Deliverables

Routing:
/availability redirect and nested routes for calendar/manage/patterns/privacy fully working.
Bottom nav “Calendar” routes to /availability/calendar.
Components created under src/components/availability as listed above.
useAvailability hooks refactored to use availabilityService.
AvailabilityCalendar and CalendarLegend updated to use theme tokens and a11y improvements.
No TypeScript errors. Keep existing tests/dev flows working.
Acceptance checks

Navigating to:
/availability → redirects to /availability/calendar.
/availability/calendar → displays the calendar with legend, overlay toggles, and accessible grid.
/availability/manage → displays AvailabilityManager with calendar + quick actions + bulk editor + presets + slot selector.
/availability/patterns → shows RecurringPatternManager that opens PatternWizard/PatternPreview/PatternExceptions.
/availability/privacy → shows AvailabilityPrivacyDashboard with visibility controls and links to VisibilityPreview and AccessControlManager.
Clicking the bottom “Calendar” tab lands at /availability/calendar.
Visual colors align with the theme (no hex literals).
Keyboard can navigate the calendar; screen readers announce dates and statuses.
Hooks fetch from availabilityService; updates invalidate relevant query keys.
Files you will modify or create

Modify:
main.tsx
src/App.GetMyGrapher.tsx
src/components/navigation/BottomNavigation.tsx (to point “Calendar” to /availability/calendar)
src/hooks/useAvailability.ts
src/components/availability/AvailabilityCalendar.tsx
src/components/availability/CalendarLegend.tsx
src/components/availability/RecurringPatternManager.tsx (wire wizard/preview/exceptions)
Create (under src/components/availability/):
PatternWizard.tsx
PatternPreview.tsx
PatternExceptions.tsx
BookingAvailabilityBridge.tsx
BookingConflictResolver.tsx
AvailabilityBookingStatus.tsx
BookingCalendarOverlay.tsx
AvailabilityPrivacyDashboard.tsx
VisibilityPreview.tsx
AccessControlManager.tsx
CalendarExport.tsx
CalendarImport.tsx
CalendarSync.tsx
Optional:
src/services/availabilityRealtime.ts (stub event emitter; no hard dependency)
Notes

Keep the existing onboarding flow and other app areas unchanged.
Keep mocked services and do not add external dependencies.
Maintain consistent naming and TypeScript interfaces already defined in src/types/availability.ts and src/types/enums.ts.