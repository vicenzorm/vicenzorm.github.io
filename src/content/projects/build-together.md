---
title: Build Together
tagline: Real-time team collaboration for retros and planning poker
role: Architect
year: '2025'
order: 2
stack: [Swift, SwiftUI, The Composable Architecture, WebSockets, iOS, macOS]
summary: >-
  A cross-platform iOS and macOS collaboration tool built in raw TCA, with
  live WebSocket state sync, optimistic updates, and automatic reconnection.
metrics:
  - Cross-platform iOS + macOS
  - Live shared state across concurrent participants
---

## The problem

Build Together is two collaboration tools in one app: an Easy Retro-style board for retrospectives and a planning poker tool for estimation. Both need the same thing underneath — several people looking at the same session at the same time, seeing each other’s changes without refreshing, without stepping on each other, and without the app falling over when a connection drops.

The wrinkle was the audience. This was built for a roughly 50-person multidisciplinary squad, which meant the architecture had to be legible to people who hadn’t written it and wouldn’t be around when it broke.

## What I built

I architected the app in raw TCA (The Composable Architecture), which meant every piece of state and every side effect goes through explicit, testable reducers rather than being scattered across view models. On top of that I built the real-time layer: a WebSocket connection that pushes state changes to every participant live, applies optimistic updates so your own actions feel instant instead of waiting on a round trip, and reconnects automatically if the connection drops.

The app runs on both iPhone and Mac, which matters for a tool people are going to have open during a meeting on whatever device is in front of them.

## Decisions that mattered

Retro boards and planning poker are data-dense multi-user UIs, which is precisely where ad hoc state management produces bugs nobody can reproduce — too much state changing at once, from too many people, for informal wiring to stay correct. Raw TCA is more ceremony upfront, but it keeps the reconciliation between what the server sent and what the UI shows in one auditable place instead of leaking into every view.

Treating the WebSocket as a decoupled side effect rather than baking it into screens is what let optimistic updates and reconnection stay consistent across both the retro board and the poker flow, instead of being implemented twice and drifting apart.

## What shipped

A working cross-platform app where a room of people can run a retro or a planning poker session together, watch changes land live, and not notice when someone’s WiFi hiccups and reconnects behind the scenes.
