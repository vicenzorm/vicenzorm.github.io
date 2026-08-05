---
title: Every Minute
tagline: A visionOS escape room about the signs you learn to ignore
role: Developer, 5-person team
year: '2026'
order: 4
stack: [Swift, RealityKit, ARKit, SwiftUI, ECS, Speech, Spatial Audio, visionOS]
summary: >-
  A fully immersive Apple Vision Pro puzzle experience where you open a
  stranger's suitcase and piece together what happened to her — built
  hands-only, with no controllers and no floating UI.
metrics:
  - 17-phase narrative state machine, zero branching logic in views
  - Hands only — pinch, drag, rotate, and your own voice
  - Concept to playable build in a one-week sprint, 5-person team
---

## The problem

Every Minute is an escape room in the vein of The Room, except the box you are opening belongs to someone. You find a suitcase, you solve your way into its compartments, and the phone keeps ringing while you do it. By the end you have reconstructed Jane's story — control, isolation, jealousy, fear — and the experience closes on the statistic it was built around: one in three women worldwide experience physical or sexual violence.

That framing set the hard part. A game about coercive control cannot feel like a menu. Every seam — a loading screen, a floating button, a mistimed sound — breaks the thing the piece depends on. So the design constraint was total: full Immersive Space, no controllers, no world-space chrome. You use your hands, and near the end, your voice.

## What I built

I worked across the interaction and navigation layers of an app built around two routers and an entity-component system — the split that kept five people out of each other's way.

`NavigationRouter` owns scene lifecycle — launcher window, menu space, content warning, immersive space, and the transitions between them. `ExperienceRouter` owns the story: a 17-phase state machine running from the audio intro through three puzzles, three phone calls, and a final branch that decides which ending you get. Overlays are a computed property of the current phase, so `ImmersiveView` renders whatever the phase says and contains no decision logic of its own. Adding a beat to the narrative means adding a case, not rewiring a view.

Interaction is pure RealityKit ECS. Interactive objects are identified by marker components rather than entity names, because names in a USDZ change the moment an artist re-exports. Gestures resolve through an `.ancestor(with:)` lookup, so a pinch on a hinge finds the lid it belongs to instead of grabbing whatever mesh happened to be under your fingers. The final puzzle drops the hands entirely: `SFSpeechRecognizer` listens for you to say an address out loud into a live phone call, matched against a confidence threshold.

## Decisions that mattered

Naming entities is the obvious way to wire a 3D scene and the wrong one. Once the 3D artists on the team started iterating on the suitcase, string-matched logic broke silently every re-export. Marker components made the contract explicit — a `SuitcaseLidComponent` either exists on an entity or it doesn't, and the compiler is involved either way. That single rule is what let modeling and engineering run in parallel through the sprint.

Making the overlay a pure function of narrative phase was the other one. Immersive experiences accumulate state fast — audio playing, space open, hand tracking live, a call in progress — and the usual failure is a view that knows about six of those at once. Deriving overlay from phase meant the audio, the pause behavior, and the visible UI could never disagree about where you are in the story.

The visionOS budget forced its own discipline: eight dynamic lights maximum, textures under 2MB, models under 100k polygons, all to hold 60fps in a scene lit almost entirely by a single lamp. Collision shape generation is opt-in per entity for the same reason.

## What shipped

A playable Vision Pro experience that runs start to finish in one unbroken immersive space — audio intro, content warning, three puzzles, a branching ending, and a closing data screen that names what the fiction was about. Built by five people in a week, with the story it was made to tell intact.
