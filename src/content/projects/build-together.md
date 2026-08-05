---
title: Build Together
tagline: Real-time retros and planning poker, built by a 50-person squad
role: Developer · ~50-person squad
year: '2026'
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

I worked as one of the developers on the app, which is built in raw TCA (The Composable Architecture) against a Swift Vapor backend. The real-time layer is the interesting part: changes push out to everyone in the session as they happen, your own actions land instantly rather than waiting on the server to agree, and a dropped connection reconnects on its own without anyone noticing it went. It runs on both iPhone and Mac, because people have this open during a meeting on whatever device is already in front of them.

For one two-week sprint I served as platform for my group — running the ceremonies, reviewing incoming pull requests, and doing QA on what came out of them. That fortnight was the most useful thing I did on the project. Reviewing other people's TCA at volume is how you find out which parts of an architecture actually transfer to people who weren't in the room when it was chosen.

## Decisions that mattered

Retro boards and planning poker are dense, and everything on them is moving at once because several people are moving it. That's exactly the territory where casual state management produces bugs nobody can reproduce. TCA is more ceremony upfront, but it keeps the reconciliation between what the server said and what you're looking at in one place you can actually audit, instead of letting it seep into every screen. On a fifty-person codebase the ceremony is the point — it makes a change something one reviewer can hold in their head.

Keeping the live connection out of individual screens is what let the instant-feedback and reconnection behavior work identically in the retro board and the poker flow, rather than being built twice and drifting apart by the third sprint.

## What shipped

A cross-platform app where a room of people can run a retro or a planning poker session together, watch changes land live, and never notice when someone's WiFi hiccups and reconnects behind the scenes.

The squad ran its own retros on it. That's the test that matters for a tool like this — fifty developers who know exactly where the bodies are buried choosing it anyway, in a meeting they have to sit through regardless. It's currently in App Store review.
