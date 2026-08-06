---
title: "Causal Discovery"
slug: "causal-discovery"
description: "A long/short US equity strategy that trades causal relationships instead of correlations using the PCMCI algorithm."
tech: ["Causal Inference", "PCMCI", "Equities", "Macro"]
status: active
order: 7
---

Building a long/short US equity strategy that trades causal relationships instead of correlations. We use PCMCI (a causal discovery algorithm from climate science) to learn which macro variables — oil, credit spreads, VIX, rates — actually drive individual stocks, and at what time lag.

Correlation can't tell you whether X moves Y or Y moves X, and it breaks down exactly when you need it most (crises). Directed causal links are more structurally stable, and the lag between a driver moving and the stock repricing is a tradeable window.
