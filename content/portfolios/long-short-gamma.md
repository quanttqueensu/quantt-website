---
title: "Long/Short Gamma"
slug: "long-short-gamma"
description: "A regime-switching long/short gamma strategy on SPY options that exploits the volatility risk premium with hourly delta hedging."
tech: ["SPY Options", "Machine Learning", "Deep Hedging", "IBKR API"]
status: active
order: 4
---

A regime-switching long/short gamma strategy on SPY options that exploits the volatility risk premium — going long gamma via ATM straddles when implied vol is cheap, short gamma via OTM strangles when it's rich, with hourly delta hedging to isolate pure vol exposure.

Analysts build a machine-learning realized volatility forecast that feeds signal generation, connected to live paper execution through IBKR's API.

The team compares ways of going long and short gamma, such as straddles and strangles.

It also researches, builds, and tests deep hedging as the primary risk management technique.
