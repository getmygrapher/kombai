# ADR-002: Realtime Service Interface and Fallbacks

## Context
Realtime features (typing, read receipts, presence, incoming messages) must be optional and degrade gracefully.

## Decision
- Introduce `communicationRealtimeService` with `.on(event)` and `.emit(event)` handlers and `enable` flag.
- Store exposes per-conversation typing and per-user presence maps, with legacy arrays for compatibility.
- If disabled or disconnected, UI continues to function via optimistic updates and polling/pagination.

## Status
Accepted.

## Consequences
- Feature-flagged rollout possible without breaking existing UI.
- Clear integration points for backend websocket later.
