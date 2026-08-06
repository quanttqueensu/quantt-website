---
title: "Earnings IV-Crush"
slug: "earnings-iv-crush"
description: "Systematically selling options volatility around earnings announcements to harvest the collapse of the fear premium."
tech: ["Options", "Volatility", "Term Structure", "Backtesting"]
status: active
order: 3
---

Systematically selling options volatility around earnings announcements. Option prices carry a "fear premium" before earnings; the moment the news drops, that premium collapses (the IV crush). We test whether harvesting it is profitable after realistic costs.

Not every earnings event is worth selling. We filter using the options term structure: how elevated near-expiry implied volatility is versus longer-dated options, relative to each name's own history. Only the richest setups get traded.
