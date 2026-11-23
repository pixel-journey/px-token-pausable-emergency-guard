# Sources

| Source | Use |
| --- | --- |
| [eosio.msig in eosio.contracts](https://github.com/eosio/eosio.contracts) | How a proposal can satisfy an authority |
| [docs.wax.io](https://docs.wax.io/) | WAX accounts and permissions |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | `require_auth`, permissions |
| [msig simulator](https://github.com/pixel-journey/wax-multi-sig-proposal-builder-and-simulator) | Named proposals vs this gate |
| [wharfkit/skill](https://github.com/wharfkit/skill) | SessionKit if a host later signs pause/unpause |
| [ANTELOPE-PORTABILITY](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ANTELOPE-PORTABILITY.md) | Auth patterns port; account names do not |

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
```

## Product facts locked by this lab

- **Pause:** admin only. **Unpause:** admin **or** a recovery permission.
- Admin and recovery must be **different** accounts. Same key is a single-key deadlock.
- Second pause throws `already paused` (unlike the template, which sets true again).
- `transferGate` blocks transfers while paused. Unpause itself must not require the paused admin path alone.
- The string `eosio.msig` in action data is **not** a completed proposal. Production is `require_auth` on a permission whose threshold is a multisig.
- This lab does **not** propose an msig transaction and does **not** move balances.

Do not copy [template pause](https://github.com/pixel-journey/px-antelope-contract-template) into a token and assume transfers stop. The template only returns a boolean.

## Portability

Split-key pause/unpause ports across Antelope. Account names, msig layout, and chain id are local.

## Related labs

| Lab | Topic |
| --- | --- |
| [token ledger](https://github.com/pixel-journey/px-token-balance-ledger) | Balances under a pause |
| [fee splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter) | Config changes under pause |
| [dex tax](https://github.com/pixel-journey/px-token-dex-differentiated-tax) | Rate changes under admin |
| [invariant kit](https://github.com/pixel-journey/px-invariant-kit) | Shared gates |
| `px-contract-examples-vault` (private; not this public course) | Curriculum order |
