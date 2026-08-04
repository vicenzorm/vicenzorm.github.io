---
title: Equillibrium
tagline: An on-device walking and mobility companion
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

The whole pipeline runs on device: HealthKit read, CoreML inference, Foundation Models generation, no network call anywhere in the loop. That was a deliberate constraint, not a fallback — gait and health data is personal, and the fewer places it travels, the better. It also forced the classifier to be small: it comes in under 1MB and infers in under 50ms, which is what keeps the whole daily scoring pipeline fast enough to run locally, delivering results in under 2 seconds instead of leaving the device for a slower round trip.

MVVM-C with a protocol-bounded domain layer was the architecture choice that let the ML side change without touching the view layer, since the domain layer only knows about interfaces, not concrete HealthKit or CoreML types.

## What shipped

A solo-built iOS app that reads real HealthKit walking data, scores it against your own history rather than a population average, and returns a result in under 2 seconds with zero network calls involved.
