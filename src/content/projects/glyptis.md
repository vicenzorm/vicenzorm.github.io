---
title: Glyptis
tagline: One voxel sculpture, anchored in as many real places as people take it
role: Developer · 5-person team
year: '2025'
order: 6
stack: [Swift, SwiftUI, UIKit, SceneKit, RealityKit, ARKit, CloudKit, MapKit]
summary: >-
  A voxel sculpture editor for iOS where one canonical artwork can be
  anchored in Augmented Reality at multiple real-world locations, each with
  its own local collaborators, without touching the author's original.
metrics:
  - Live on the App Store
  - Five developers, Apple Developer Academy 2025
links:
  appStore: https://apps.apple.com/us/app/glyptis-realidade-esculpida/id6755839447
---

## The problem

Glyptis started as a technical question more than a product one: what happens to a piece of art once it can exist in more than one place at once? You build a sculpture out of colored voxels, and that sculpture is one file, owned by one author. But a sculpture anchored in AR only means something where it's anchored — a plaza, a park, a specific spot on a map. So the same artwork needed to support many independent real-world instances, each anchored somewhere different, each open to its own local collaborators, without any of that touching the author's original.

## What I built

I worked on the voxel editor and the AR anchoring, alongside four other developers. The editor places blocks on an X/Y/Z grid with SceneKit driving the 3D view — camera movement, block placement, color — while ARKit takes the finished sculpture and anchors it to a point in the physical world, holding its position and orientation against the camera feed. The CloudKit sync layer and MapKit-based location browsing were built by the rest of the team.

## Decisions that mattered

The model the team settled on treats a sculpture as one canonical artifact with any number of location-bound instances hanging off it. Editing an instance at one location never writes back to the author's file or to any other instance — it's a fork in practice, not just in name. That separation is what makes local collaboration possible at all: a group of people editing a sculpture anchored at one park bench can't corrupt what the original author made, or what a different group is doing with the same sculpture across town.

On the AR side, the anchor had to hold up once someone actually walked around it, not just look right in a static preview. Respecting real position and orientation, rather than dropping a model in front of the camera, is what keeps the sculpture from drifting or wobbling as the camera moves.

## What shipped

Glyptis is live on the App Store: a voxel editor that renders and anchors sculptures in AR, syncs them through CloudKit, and lets the same artwork have independent lives at different points on a map. Five developers, built during the Apple Developer Academy's 2025 cohort.
