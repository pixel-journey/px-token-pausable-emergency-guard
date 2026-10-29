# px-token-pausable-emergency-guard

> **Trust:** private educational lab (Tier B)  
> **Quest:** 111 — pausable emergency guard  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach a **pause switch** for transfers where **only admin pauses**, and **admin or `eosio.msig` unpauses**, so recovery is not a single-key deadlock.

**Real code:** `npm test`. **Not** a full token, **not** wasm, **not** a live msig.

---

## What is true (executed)

| Rule | Result |
|------|--------|
| Admin pause | ok |
| Non-admin pause | refused |
| Unpause by admin or `eosio.msig` | ok |
| Unpause by random account | refused |
| Transfer while paused | refused |
| Transfer while live | ok (gate only) |

```bash
npm test
```

## License

MIT — Pixel Journey
