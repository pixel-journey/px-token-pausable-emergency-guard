# Sources

| Source | Use |
| --- | --- |
| [eosio.msig in eosio.contracts](https://github.com/eosio/eosio.contracts) | How a proposal can satisfy an authority |
| [docs.wax.io](https://docs.wax.io/) | WAX accounts and permissions |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | `require_auth`, permissions |

## Product facts locked by this lab

- **Pause:** admin only. **Unpause:** admin **or** a recovery permission.
- Admin and recovery must be **different** accounts. Same key is a single-key deadlock.
- Second pause throws `already paused` (unlike the template, which sets true again).
- `transferGate` blocks transfers while paused. Unpause itself must not require the paused admin path alone.
- The string `eosio.msig` in action data is **not** a completed proposal. Production is `require_auth` on a permission whose threshold is a multisig.
- This lab does **not** propose an msig transaction and does **not** move balances.

Do not copy [template pause](https://github.com/pixel-journey/px-antelope-contract-template) into a token and assume transfers stop. The template only returns a boolean.

## Related labs

| Lab | Topic |
| --- | --- |
| [token ledger](https://github.com/pixel-journey/px-token-balance-ledger) | Balances under a pause |
| [fee splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter) | Config changes under pause |
| [dex tax](https://github.com/pixel-journey/px-token-dex-differentiated-tax) | Rate changes under admin |
| [invariant kit](https://github.com/pixel-journey/px-invariant-kit) | Shared gates |
| [treasury path](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/TREASURY-TOKEN-LEARNING-PATH.md) | Curriculum order |
