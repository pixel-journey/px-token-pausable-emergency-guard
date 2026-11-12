# Pause is tight. Unpause is not a single key.

> **Trust:** private educational lab (Tier B)  
> **Domain:** emergency pause guard  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach a **pause switch** for transfers where **only admin pauses**, and **admin or `eosio.msig` unpauses**, so recovery is not a single-key deadlock.

**Real code:** `npm test`. **Not** a full token, **not** a live msig proposal.

**Production mirror:** [pxguard](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxguard) — [run 24](https://github.com/pixel-journey/wax-contract-compiler/actions/runs/42821960554), wasm `da54a7088823…`, audit 0/0. **Not deployed.**

Docs: [docs.eosnetwork.com](https://docs.eosnetwork.com/), [docs.wax.io](https://docs.wax.io/).

## What is true (executed)

| Rule | Result |
| --- | --- |
| Admin pauses | `paused: true` |
| Admin or `eosio.msig` unpauses | live again |
| Second pause / transfer while paused / zero amount | refused |

## Run

```bash
npm test
```

MIT — Pixel Journey
