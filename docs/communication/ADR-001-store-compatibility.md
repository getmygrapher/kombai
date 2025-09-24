# ADR-001: Communication Store Compatibility and Stabilization

## Context
The existing communication store had a hard-coded current user id and inconsistent read state handling. Presence and typing were tracked only via flat arrays.

## Decision
- Remove hard-coded user id by reading from `useAppStore().user?.id` with fallback to `user_123` to maintain backward compatibility.
- Ensure `markConversationAsRead` also updates `MessageStatus.READ` for messages received by the current user.
- Keep `conversations.lastMessage` in sync when updating messages.
- Recompute total unread counts after mutations; add a subscription to keep `unreadMessageCount` consistent.
- Introduce `typingByConversation` and `onlineStatusByUser` maps while keeping legacy `activeTypingUsers` and `onlineUsers` arrays derived for compatibility.

## Status
Accepted.

## Consequences
- Existing components continue to work without prop changes.
- New features can use per-conversation typing and user presence maps.
- Minimal risk; changes are additive and backward-compatible.
