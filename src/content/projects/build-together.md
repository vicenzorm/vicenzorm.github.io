---
title: Build Together
tagline: Real-time retros and planning poker, built by a 50-person squad
role: Developer · ~50-person squad
year: '2025'
order: 2
stack: [Swift, SwiftUI, The Composable Architecture, Vapor, WebSockets, iOS, macOS]
summary: >-
  A cross-platform iOS and macOS collaboration tool with live WebSocket
  state sync, built in raw TCA against a Swift Vapor backend by a
  fifty-person squad running the Spotify model.
metrics:
  - Roughly 50 developers on one codebase
  - Used by the squad that built it, for its own retros
  - Submitted for App Store review
---

## The problem

Build Together is two collaboration tools in one app: an Easy Retro-style board for retrospectives and a planning poker tool for estimation. Both need the same thing underneath — several people in the same session at once, seeing each other's changes without refreshing, without stepping on each other, and without the app falling over when someone's connection drops.

The harder problem was upstream of any of that. Roughly fifty developers worked on this codebase, organized on the Spotify model. At that headcount the limiting factor stops being whether someone can write the feature and becomes whether the next person can read it — and whether fifty people's changes still add up to one coherent app at the end of the sprint.

## What I built

I worked as one of the developers on the app, which is built in raw TCA (The Composable Architecture) against a Swift Vapor backend. TCA routes every piece of state and every side effect through explicit, testable reducers instead of scattering them across view models. The real-time layer sits on top: a WebSocket connection that pushes state changes to every participant live, applies optimistic updates so your own actions feel instant instead of waiting on a round trip, and reconnects on its own when the connection drops. It runs on both iPhone and Mac, because people have this open during a meeting on whatever device is in front of them.

For one two-week sprint I served as platform for my group — running the ceremonies, reviewing incoming pull requests, and doing QA on what came out of them. That fortnight was the most useful thing I did on the project. Reviewing other people's TCA at volume is how you find out which parts of an architecture actually transfer to people who weren't in the room when it was chosen.

## Decisions that mattered

Retro boards and planning poker are data-dense multi-user UIs, which is exactly where informal state management produces bugs nobody can reproduce — too much state changing at once, from too many people, for ad hoc wiring to stay correct. Raw TCA is more ceremony upfront, but it keeps the reconciliation between what the server sent and what the UI shows in one auditable place instead of letting it leak into every view. On a fifty-person codebase that ceremony is the point: a reducer is a diff you can review in isolation, which is not true of state spread across view models.

Keeping the WebSocket as a decoupled side effect rather than baking it into individual screens is what let optimistic updates and reconnection behave the same way in the retro board and the poker flow, instead of being implemented twice and drifting apart.

## What shipped

A cross-platform app where a room of people can run a retro or a planning poker session together, watch changes land live, and never notice when someone's WiFi hiccups and reconnects behind the scenes.

The squad ran its own retros on it. That's the test that matters for a tool like this — fifty developers who know exactly where the bodies are buried choosing it anyway, in a meeting they have to sit through regardless. It's currently in App Store review.
