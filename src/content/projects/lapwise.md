---
title: Lapwise
tagline: A swim companion that reads pace fade from your Strava splits
role: Solo · 1-person team
year: '2026'
order: 7
stack: [Swift, SwiftUI, Spring Boot, Java, PostgreSQL, Strava, OpenRouter]
summary: >-
  A personal training companion for swimmers. It syncs your swim
  activities from Strava and writes a short pace-degradation insight
  across the splits, compared with recent swims of a similar distance.
links:
  github: https://github.com/vicenzorm/lapwise-frontend
---

## The problem

Strava already has the laps. What it does not do is tell you how the pace fell apart inside a swim, or how that fade sits next to the last few times you swam about the same distance. The splits are there. The reading is not.

Lapwise is a personal swim log for that gap: pull the activities you already recorded, keep the ones with enough paced laps to say something honest, and put a short observation on the detail screen — this swim versus its own splits, and versus similar recent ones when they exist. Not a training plan. Not a weekly review.

## What I built

I built both sides. The iOS app is Swift and SwiftUI: Strava login through the system auth session, a list you sync on demand, and a detail screen with the splits and the insight. The API is Spring Boot over PostgreSQL. It owns Strava OAuth, stores the athlete's tokens, and issues the app a Lapwise session JWT so the phone never holds a Strava credential.

Sync is one blocking POST. New swims come in oldest-first, each with a Strava detail call for laps. Then the API backfills insights for any swim that has at least three paced splits and no insight row yet. Java computes the fade and picks up to five recent swims within 20% of this one's distance. OpenRouter only writes the paragraph.

## Decisions that mattered

The model does not get to invent history. Fade percent is domain math — three contiguous groups of splits, last-group pace versus first-group pace, seconds per 100 m — and the prompt receives those numbers plus a snapshot of comparable swims, not a dump of prior JSON. If this is the first swim, the snapshot says so. If Strava sent fewer than three usable splits, the swim is stored and the insight is skipped. A failed OpenRouter call leaves the rest for the next sync.

Keeping Strava tokens on the server is the other one. The app authenticates to Lapwise. Refresh, rate limits, and the messy payload cases stay where the tokens already live. The client maps the status codes it was built for — session expired, Strava rate-limited, insight unavailable — and does not parse an upstream body.

On the phone, screens talk to service protocols, not URLSession. That is what let the login, list, and detail ViewModels get tested against fakes without standing up Spring.

## What shipped

A working iOS client and a Java API: Strava login, on-demand sync, a paginated swim list, and a detail screen that shows splits plus the insight when one exists. Source for both sides is public.
