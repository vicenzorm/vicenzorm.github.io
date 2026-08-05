---
title: Shiro
tagline: An arcade game, live on the App Store
role: 5-person team
year: '2025'
order: 1
stack: [Swift, SpriteKit, GameplayKit, GameKit, Game Center]
summary: >-
  A complete iOS arcade game taken from concept to App Store launch with a
  five-person team, with Game Center leaderboards and achievements.
links:
  appStore: https://apps.apple.com/br/app/shiro/id6752502968
---

## The problem

Most side projects never leave the simulator. Shiro had the opposite goal from day one: get an arcade game all the way onto the App Store — five people on the codebase, a real review process at the end, and a shipping date that didn't move.

## What I built

The game world and its logic run on SpriteKit and GameplayKit. On top of that I wired up GameKit, so Shiro shipped with working Game Center leaderboards and achievements rather than the placeholder versions that usually get cut before submission.

## Decisions that mattered

Arcade games live or die on feel, and SpriteKit gives you a scene graph and physics you can reason about directly — which matters a lot when five people are pushing to the same repo and every one of them needs to predict what a change will do to the game's timing.

Using GameKit for leaderboards and achievements instead of rolling our own backend was the choice that made shipping realistic. No server to run, no accounts to manage, no privacy surface to defend in review. On a team that size with a fixed deadline, the feature you don't have to operate is worth more than the one you control.

## What shipped

Shiro is live on the App Store today, achievements and leaderboards included. The game was the artifact; getting it from first prototype to an approved listing with five people was the actual deliverable.
