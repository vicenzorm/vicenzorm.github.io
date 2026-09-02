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

Shiro is an endless runner that runs the wrong way. Instead of scrolling sideways, you climb from the bottom of the screen to the top, dashing through falling wood logs and spiked ice balls, going until something hits you. You play the whole game with one timed input.

The goal from the first week was five people, one month, and a real App Store review at the end of it.

## What I built

The game itself runs on SpriteKit and GameplayKit. That covers the climb, the falling obstacles, and the collisions that end your run. On top of that I wired up Game Center, so Shiro shipped with working leaderboards and achievements instead of the stubbed versions that usually get cut in the last week before submission.

## Decisions that mattered

A few frames of drift between what the player sees and when the hit registers turns a fair death into a cheap one on a game whose only input is a timed dash, and players leave. SpriteKit keeps that timing somewhere you can reason about directly, which matters when five people are pushing to the same repo and each of them needs to predict what their change does to it.

Leaning on Game Center instead of building our own backend is what made the deadline survivable. We had no server to run and no accounts to manage. On a five-person team with a month, I would rather ship a feature I do not have to operate.

## What shipped

Shiro is live on the App Store with 100+ downloads, achievements and leaderboards included. The game was the artifact. Getting it from first prototype to an approved listing in a month, with five people, was the work.
