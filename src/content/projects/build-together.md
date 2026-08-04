---
title: Build Together
tagline: Real-time team collaboration for retros and planning poker
role: ~50-person squad organization
year: '2025'
order: 2
stack: [Swift, SwiftUI, The Composable Architecture, WebSockets, iOS, macOS]
summary: >-
  A cross-platform iOS and macOS collaboration tool built in raw TCA, with
  live WebSocket state sync, optimistic updates, and automatic reconnection.
metrics:
  - Cross-platform iOS + macOS from one codebase
  - Live shared state across concurrent participants
---

## The problem

Build Together is two collaboration tools in one app: an Easy Retro-style board for retrospectives and a planning poker tool for estimation. Both need the same thing underneath — several people looking at the same session at the same time, seeing each other's changes without refreshing, without stepping on each other, and without the app falling over when a connection drops.

## What I built

I architected the app in raw TCA (The Composable Architecture), which meant every piece of state and every side effect goes through explicit, testable reducers rather than being scattered across view models. On top of that I built the real-time layer: a WebSocket connection that pushes state changes to every participant live, applies optimistic updates so your own actions feel instant instead of waiting on a round trip, and reconnects automatically if the connection drops.

The app runs on both iPhone and Mac from a single SwiftUI codebase, which matters for a tool people are going to have open during a meeting on whatever device is in front of them.

## Decisions that mattered

Retro boards and planning poker are both data-dense, multi-user UIs — cards moving, votes coming in, cursors updating — and that's exactly the kind of surface where ad hoc state management turns into bugs no one can reproduce. Raw TCA forces state changes through reducers, which is more ceremony upfront but means the sync logic between "what the server sent" and "what the UI shows" stays in one place instead of leaking into every view.

Keeping WebSocket handling as a decoupled side effect rather than baking it into individual screens is what let optimistic updates and reconnection logic stay consistent across both the retro board and the poker flow, instead of being reimplemented twice.

I built this alongside a roughly 50-person multidisciplinary squad, which meant the architecture also had to be legible to people who weren't the one who wrote it.

## What shipped

A working cross-platform app where a room of people can run a retro or a planning poker session together, watch changes land live, and not notice when someone's WiFi hiccups and reconnects behind the scenes.
