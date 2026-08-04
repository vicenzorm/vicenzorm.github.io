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

Most side projects never leave a simulator. Shiro was the opposite goal: take an arcade game all the way from an idea to something sitting on the actual App Store, with five people working on it at once and a real submission process at the end.

## What I built

The iOS build uses SpriteKit and GameplayKit for the game world and its logic. On top of that, I wired up GameKit to bring in Game Center, so the game ships with real leaderboards and achievements.

## Decisions that mattered

Arcade games live or die on feel, and SpriteKit gives you a scene graph and physics you can reason about directly, which matters when five people are touching the same codebase. Using GameKit for leaderboards and achievements instead of rolling a custom backend meant no server to run and no accounts to manage.

## What shipped

Shiro is live on the App Store today, achievements and leaderboards included. Getting a game through App Store submission as part of a small team, from first prototype to an approved listing, was the actual deliverable here.
