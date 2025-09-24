# Developer Realtime Panel (Frontend-Only)

This panel simulates realtime behaviors for the communication system entirely on the frontend.

## Features
- Typing indicator (per conversation)
- Presence toggle (online)
- Incoming message injection
- Mark-as-read

## Usage
- Open Messages (Enhanced) screen in dev mode (import.meta.env.DEV true)
- Panel appears below the messages interface
- Select a conversation id, then click:
  - Typing: shows typing indicator for the other participant for ~1.5s
  - Presence: marks the other participant online
  - Incoming: injects a message from the other participant
  - Read: marks the conversation read

## Notes
- No backend required; all effects update the Zustand store
- Use this for demos and QA scenarios to validate UI flows and states