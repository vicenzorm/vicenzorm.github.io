---
title: Shiro
tagline: An arcade climber, live on the App Store
role: Developer · 5-person team
year: '2025'
order: 1
stack: [Swift, SpriteKit, GameplayKit, GameKit, Game Center]
summary: >-
  An endless-climb arcade game built by five people and taken all the way
  to an approved App Store listing in a month, with Game Center
  leaderboards and achievements.
metrics:
  - 100+ downloads on the App Store
  - One month from concept to approved listing
  - Game Center leaderboards and achievements at launch
links:
  appStore: https://apps.apple.com/br/app/shiro/id6752502968
---

## The problem

Shiro is an endless runner that runs the wrong way. Instead of scrolling sideways, you climb — bottom of the screen to the top, dashing through falling wood logs and spiked ice balls, going until something hits you. The whole game lives in one input and how well you time it.

Most games like it never leave the simulator. Shiro had the opposite goal from the first week: five people, one month, and a real App Store review at the end of it.

## What I built

The game world and its logic run on SpriteKit and GameplayKit — scene graph, physics, and collision for the climb, the obstacles, and the dash. On top of that I wired up GameKit, so Shiro shipped with working Game Center leaderboards and achievements rather than the stubbed versions that usually get cut in the last week before submission.

## Decisions that mattered

Arcade games live or die on feel. In a climber where the only verb is a timed dash, a few frames of drift between what the player sees and when the collision registers is the difference between a fair death and a cheap one. SpriteKit gives you a scene graph and physics you can reason about directly, which matters when five people are pushing to the same repo and every one of them needs to predict what their change does to that timing.

Using GameKit for leaderboards and achievements instead of rolling our own backend was the choice that made the deadline survivable. No server to run, no accounts to manage, no privacy surface to defend in review. On a five-person team with a month, the feature you don't have to operate is worth more than the one you control.

## What shipped

Shiro is live on the App Store with 100+ downloads, achievements and leaderboards included. The game was the artifact; getting it from first prototype to an approved listing in a month, with five people, was the actual deliverable.
