# AI handoff — pausable emergency guard

## Agent tooling

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
```

| Source | Role |
| --- | --- |
| [eosio.msig](https://github.com/eosio/eosio.contracts) | How a proposal can satisfy authority |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | require_auth, permissions |
| [token ledger](https://github.com/pixel-journey/px-token-balance-ledger) | Balances under a pause |

## Non-negotiables

1. **Pause:** admin only. **Unpause:** admin **or** recovery permission.
2. Admin and recovery must be **different** accounts. Same key is a single-key deadlock.
3. Second pause throws `already paused` (unlike the template, which may set true again).
4. `transferGate` blocks transfers while paused.
5. The string `eosio.msig` in action data is **not** a completed proposal. Production is `require_auth` on a multisig permission.
6. This lab does **not** propose an msig and does **not** move balances.
7. Do not copy [template pause](https://github.com/pixel-journey/px-antelope-contract-template) into a token and assume transfers stop — template only returns a boolean.
8. Split-key pause/unpause ports; account names and msig layout are chain-local.

## Prompt seeds

- "Admin lost — can recovery unpause without admin?"
- "Second pause — already paused."
- "Show why embedding the string eosio.msig is not an executed proposal."
- "Wire transferGate to the ledger without moving funds in this pure lab."

## Do not

- Allow admin === recovery.
- Treat msig string as executed.
- Claim balances move while testing the gate.
