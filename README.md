# Pause transfers with an msig recovery path

> **Domain:** emergency pause guard  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**Goal:** Admin may **pause** transfers; **admin or `eosio.msig`** may unpause so a lost admin key is not a permanent deadlock.

**Code under test:** `npm test` (unit + lifecycle composition).

## Learning materials

| Doc | Role |
| --- | --- |
| [EDUCATION.md](EDUCATION.md) | Beginner → masterclass |
| [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md) | Pause, msig unpause, refusals |
| [TIPS.md](TIPS.md) | Escape hatch design |
| [SECURITY.md](SECURITY.md) | Authority matrix |
| [SOURCES.md](SOURCES.md) | msig docs |

## What is true (executed)

| Rule | Result |
| --- | --- |
| Only admin pauses | enforced |
| Admin or msig unpauses | enforced |
| transferGate while paused | refused |
| Composition | full pause/recover cycle |

```bash
npm test
```

MIT — Pixel Journey
