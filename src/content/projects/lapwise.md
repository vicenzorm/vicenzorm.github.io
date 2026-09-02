---
title: Lapwise
tagline: A swim companion that reads pace fade from your Strava splits
role: Solo · 1-person team
year: '2026'
order: 7
stack: [Swift, SwiftUI, Spring Boot, Java, PostgreSQL, Strava, OpenRouter]
summary: >-
  I built a swim log that syncs Strava activities and writes a short
  insight on how pace faded across the splits, set next to recent
  swims of a similar distance.
links:
  github: https://github.com/vicenzorm/lapwise-frontend
---

## The problem

I log my swims on Strava, and each activity includes the laps. After I get out I compare them by eye. I look at pace in the back half versus the front, then at that fade versus the last few times I swam about the same distance.

I built Lapwise to do that comparison. It pulls the activities I recorded and keeps the ones with at least three paced laps. The detail screen shows a short insight for this swim versus its own splits, and versus similar recent swims when those exist.

## What I built

I built both sides. The iOS app is Swift and SwiftUI. Strava login goes through the system auth session, and I sync the list on demand. The detail view is the splits plus that insight.

The API is Spring Boot over PostgreSQL. It owns Strava OAuth, stores the athlete's tokens, and issues the app a Lapwise session JWT. The phone does not hold a Strava credential.

Sync is one blocking POST. I pull new swims oldest-first, each with a Strava detail call for laps, then write insights for any swim that has at least three paced splits and no insight row yet. Java computes the fade and picks up to five recent swims within 20% of this one's distance. OpenRouter writes the paragraph from those numbers.

## Decisions that mattered

Fade percent is domain math. I split the paced laps into three contiguous groups and compare last-group pace to first-group pace, in seconds per 100 m. The prompt receives those numbers plus a snapshot of comparable swims.

If this is the first swim, I send a snapshot that says so. I store a swim with fewer than three usable splits and skip the insight. If OpenRouter fails, I leave that swim for the next sync.

I kept Strava tokens on the server. The app authenticates to Lapwise. Refresh, rate limits, and messy payload cases stay where the tokens live. The client maps session expired, Strava rate-limited, and insight unavailable. It does not parse an upstream body.

On the phone, screens depend on service protocols. I tested the login, list, and detail ViewModels against fakes without standing up Spring.

## What shipped

A working iOS client and a Java API. Strava login, on-demand sync, a paginated swim list, and a detail screen that shows splits plus the insight when one exists. I published the source for both sides.
