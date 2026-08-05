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

The game itself runs on SpriteKit and GameplayKit — the climb, the falling obstacles, and the collisions that end your run. On top of that I wired up Game Center, so Shiro shipped with working leaderboards and achievements instead of the stubbed versions that usually get cut in the last week before submission.

## Decisions that mattered

Arcade games live or die on feel. When the only thing a player does is time a dash, a few frames of drift between what they see and when the hit registers is the difference between a fair death and a cheap one — and cheap deaths are the reason people delete the app. SpriteKit keeps that timing somewhere you can reason about directly, which matters when five people are pushing to the same repo and each of them needs to predict what their change does to it.

Leaning on Game Center instead of building our own backend is what made the deadline survivable. No server to run, no accounts to manage, no privacy surface to defend in review. On a five-person team with a month, the feature you don't have to operate beats the one you control.

## What shipped

Shiro is live on the App Store with 100+ downloads, achievements and leaderboards included. The game was the artifact; getting it from first prototype to an approved listing in a month, with five people, was the actual deliverable.
