---
title: Equillibrium
tagline: A walking companion whose data never leaves the phone
role: Solo
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
---

## The problem

Your iPhone already collects walking metrics through HealthKit in the background, without you doing anything. That data mostly sits there unused. Equillibrium takes five walking metrics HealthKit already tracks passively and turns them into something a person can actually read: a personal baseline for how you normally walk, and a single 0–100 Mobility Score that tracks against it.

## What I built

I structured the app in MVVM-C with a protocol-bounded domain layer, so the pieces that read HealthKit data, the pieces that score it, and the views that display it don’t know about each other’s implementation details. The core is a CoreML classifier trained to turn the five gait metrics into the Mobility Score, paired with Foundation Models to generate plain-language insights about what the score means day to day. App Intents and WidgetKit are in the stack for surfacing that score beyond the app’s own screens.

## Decisions that mattered

Nothing leaves the phone. HealthKit read, CoreML inference, Foundation Models generation — no network call anywhere in the loop. That was a constraint I set at the start rather than a fallback I settled for: gait data is a physical signature, and the fewer places it travels, the better.

The constraint paid for itself. Ruling out server-side inference forced the classifier to stay small — under 1MB, under 50ms — which is exactly what makes the daily score land in under two seconds instead of waiting on a round trip. The private version is also the fast one.

The protocol-bounded domain layer is what kept that tractable. Because the domain only knows about interfaces, not concrete HealthKit or CoreML types, I could swap classifier versions and rework the scoring math without touching a single view.

## What shipped

A solo-built iOS app that reads real HealthKit walking data, scores it against your own history, and returns a result in under 2 seconds with zero network calls involved.
