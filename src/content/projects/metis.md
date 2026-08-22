---
title: Metis
tagline: Turning a phone's passive signals into something a clinician can act on
role: Backend · 14-person team (AGES, PUCRS)
year: '2026'
order: 5
stack: [React Native, Expo, NestJS, Prisma, PostgreSQL]
summary: >-
  A mobile platform that turns passive smartphone signals — movement, sleep,
  app usage, and location patterns — into something a mental health
  professional can act on between consultations, without diagnosing.
metrics:
  - Grew out of a project awarded at the PUCRS Innovation Marathon 2025
  - Delivered as the team's 2026/1 deliverable at AGES, PUCRS
  - Patient data always shown relative to that patient's own baseline
---

## The problem

A psychologist or psychiatrist sees a patient for an hour, then loses visibility until the next appointment — weeks in which sleep, movement, and daily habits can shift in ways that matter clinically and never make it into the room. Meanwhile the patient's own phone is already generating exactly that kind of signal in the background: how much they're moving, how they're sleeping, how they're using their apps, how they're getting around. Metis exists to route that signal somewhere useful, without turning a phone into a surveillance device or a diagnostic tool it has no business being.

## What I built

I worked on the backend team, a 14-person group within the larger AGES squad building the API in NestJS with Prisma over PostgreSQL, alongside a React Native and Expo mobile app built by the rest of the team. The API separates two very different consumers of the same data: a patient-facing surface that shows wellbeing trends relative to their own history, and a professional-facing surface that adds clinical context — alerts, severity, and per-metric visibility controls the professional can toggle for what the patient sees.

## Decisions that mattered

Metis reads behavioral patterns, not content: no messages, no audio, no private material, just the kind of passive signal a phone collects regardless of what you're doing with it. What a professional actually needs isn't a raw number but a change worth flagging, so every metric the API returns is computed as a shift against that patient's own history rather than a fixed threshold — a sudden drop matters more than where it lands.

The patient and professional interfaces are strictly separated at the API layer, not hidden behind a client-side toggle: what a professional's view returns depends on the visibility settings that patient has actually turned on, enforced where the data is served rather than where it's displayed.

## What shipped

An API backing both a patient app and a professional app, delivered by a 14-person backend team as part of AGES's 2026/1 cohort at PUCRS, building on a concept that won the PUCRS Innovation Marathon in 2025.
