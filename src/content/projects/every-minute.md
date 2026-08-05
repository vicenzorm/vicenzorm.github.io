---
title: Every Minute
tagline: A visionOS escape room about the signs you learn to ignore
role: Developer · 5-person team
year: '2026'
order: 4
stack: [Swift, RealityKit, ARKit, SwiftUI, ECS, Speech, Spatial Audio, visionOS]
summary: >-
  A fully immersive Apple Vision Pro puzzle experience where you open a
  stranger's suitcase and piece together what happened to her — built
  hands-only, with no controllers and no floating UI.
metrics:
  - Live on the App Store for Apple Vision Pro
  - Hands only — pinch, drag, rotate, and your own voice
  - Four developers and a designer, three weeks
links:
  appStore: https://apps.apple.com/us/app/every-minute/id6789366168
---

## The problem

Every Minute is an escape room in the vein of The Room, except the box you are opening belongs to someone. You find a suitcase, you solve your way into its compartments, and the phone keeps ringing while you do it. By the end you have reconstructed Jane's story — control, isolation, jealousy, fear — and the experience closes on the statistic it was built around: one in three women worldwide experience physical or sexual violence.

That framing set the hard part. A game about coercive control cannot feel like a menu. Every seam — a loading screen, a floating button, a mistimed sound — breaks the thing the piece depends on. So the design constraint was total: full Immersive Space, no controllers, no world-space chrome. You use your hands, and near the end, your voice.

## What I built

I worked as one of four developers alongside a designer, over three weeks.

The app keeps two things separate that most immersive projects tangle together: where you are in the app, and where you are in the story. One layer handles the scenes — menu, content warning, the immersive space itself, and the transitions between them. The other handles the narrative, which runs as a fixed sequence of beats from the audio intro through three puzzles, three phone calls, and a branch at the end that decides which ending you get. Whatever you see floating in front of you is derived from that sequence rather than decided by the view showing it, so adding a beat to the story means adding a beat, not rewiring the scene.

The physical side is all hands. Objects announce what they are through the components attached to them rather than through their names, so the 3D artists could re-export the suitcase as often as they liked without silently breaking the code that opens it. Grabbing a hinge finds the lid it belongs to instead of whatever surface happened to be under your fingers. The last puzzle takes the hands away entirely — you have to say an address out loud, into a live call, and the app has to be sure enough it heard you.

## Decisions that mattered

Wiring a 3D scene by object name is the obvious approach and the wrong one. Every time an artist re-exported a model, anything matched by name broke — quietly, and usually not on the machine of the person who broke it. Attaching explicit markers to objects instead meant a thing either is a suitcase lid or it isn't, and the compiler has an opinion about it. That one rule is what let modeling and engineering run in parallel for three weeks instead of taking turns.

Deriving what you see from where you are in the story was the other one. Immersive apps accumulate state fast — audio playing, hand tracking live, a call in progress, the space itself opening or closing — and the usual failure is a screen that quietly knows about six of those at once and gets one wrong. Tying it all to a single position in the narrative meant the sound, the pause behavior, and the thing in front of your face could never disagree about where you were.

Then there's the budget. A headset holding sixty frames a second gives you very little to spend, and we were lighting a room with what is essentially one lamp. Eight moving lights, total. Every texture and model sized to fit. Most of the work in an immersive scene is deciding what not to render.

## What shipped

Every Minute is on the App Store for Apple Vision Pro. It runs start to finish in one unbroken immersive space — audio intro, content warning, three puzzles, a branching ending, and a closing data screen that names what the fiction was about. Five people, three weeks.
