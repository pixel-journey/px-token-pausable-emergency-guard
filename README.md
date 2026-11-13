# Pause is tight. Unpause is not a single key.

> **Domain:** emergency pause guard  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**Goal:** A **pause switch** for transfers where **only admin pauses**, and **admin or `eosio.msig` unpauses**, so recovery is not a single-key deadlock.

**Code under test:** `npm test` (unit + timeline composition). This is a gate, not a full token, and not a live msig proposal.

**Production mirror:** [pxguard](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxguard) — [run 24](https://github.com/pixel-journey/wax-contract-compiler/actions/runs/42821960554), wasm prefix `da54a7088823…`, audit 0/0. **Not deployed.**

**Docs:** [docs.eosnetwork.com](https://docs.eosnetwork.com/), [docs.wax.io](https://docs.wax.io/).

## Composition

`pause.composition.test.ts` walks live → pause → blocked transfer → **msig recovery** → live again. Successful transfer count only advances when the gate passes. Random accounts never pause or unpause.

## What is true (executed)

| Rule | Result |
| --- | --- |
| Admin pauses | `paused: true` |
| Admin or `eosio.msig` unpauses | live again |
| Second pause / transfer while paused / zero amount | refused |
| Timeline | okTransfers only counts gated successes |

```bash
npm test
```

MIT — Pixel Journey
