---
title: Equillibrium
tagline: A walking companion whose data never leaves the phone
role: Solo · 1-person team
year: '2026'
order: 3
stack: [Swift, SwiftUI, MVVM-C, HealthKit, CoreML, Foundation Models, App Intents, WidgetKit]
summary: >-
  An iPhone gait companion that turns five passively collected HealthKit
  walking metrics into a personal baseline and a 0–100 Mobility Score,
  entirely on device.
metrics:
  - Sub-1MB CoreML classifier, inference under 50ms
  - Daily results in under 2 seconds
  - Zero network calls
  - Submitted for App Store review
---

## The problem

Your iPhone is already measuring how you walk. In the background, without you enabling anything, HealthKit collects step length, step asymmetry, walking steadiness, double support time, and walking speed — five clinical gait metrics that physiotherapists use to assess mobility, sitting in an app most people open twice a year.

Equillibrium turns those five numbers into two things a person can actually act on: a personal baseline for how you normally walk, and a single 0–100 Mobility Score that tracks against it. Not a comparison to a population average — a comparison to you last month.

## What I built

The core is a CoreML classifier that maps the five gait metrics onto the Mobility Score, trained on data a physiotherapist provided so the score reflects how a clinician actually reads those numbers rather than an arbitrary weighting I invented. Foundation Models sits on top of it, generating plain-language explanations of what a given score means day to day. App Intents and WidgetKit surface the score outside the app, where a daily number is more useful than it is behind a launch.

Underneath, the part that reads your health data, the part that scores it, and the part that shows you the result know as little about each other as possible — they talk through agreed interfaces rather than reaching into each other's internals.

## Decisions that mattered

Nothing leaves the phone. HealthKit read, CoreML inference, Foundation Models generation — no network call anywhere in the loop. That was a constraint I set at the start, not a fallback I settled for. Gait is a physical signature; how you walk identifies you about as well as how you type, and the fewer places that travels, the better.

The constraint paid for itself. Ruling out server-side inference forced the classifier to stay small — under 1MB, under 50ms — which is exactly what makes the daily score land in under two seconds instead of waiting on a round trip. The private version turned out to be the fast one.

Keeping those layers at arm's length is what kept it workable. I retrained the model and reworked the scoring math several times over without touching a single screen.

## What shipped

A solo-built iOS app that reads real HealthKit walking data, scores it against your own history, and answers in about the time it takes to unlock your phone — without sending a byte of it anywhere. It's currently in App Store review.
