---
title: "Earnings IV-Crush"
slug: "earnings-iv-crush"
description: "Systematically selling options volatility around earnings announcements to capture the post-announcement drop in implied volatility."
tech: ["Options", "Volatility", "Term Structure", "Backtesting"]
status: active
order: 3
---

Systematically selling options volatility around earnings announcements. Option prices carry a volatility premium before earnings; once results are released, that premium collapses (the IV crush). The team tests whether capturing it is profitable after realistic costs.

Not every earnings event is worth selling. The team filters using the options term structure: how elevated near-expiry implied volatility is versus longer-dated options, relative to each name's own history. Only the richest setups get traded.
