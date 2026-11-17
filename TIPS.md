# Tips — emergency pause without a single-key trap

## Authority split

- **Pause:** admin only.
- **Unpause:** admin **or** a recovery permission that `eosio.msig` can satisfy.
- Admin and recovery must be **different** accounts. If they are the same key, losing admin freezes the token forever.
- Do not check `caller == "eosio.msig"` on action data. The user can set that string. Production is `require_auth` on a permission whose threshold is a multisig.

## What pause must cover

Wire the flag on **every outflow you care about**:

| Path | Typical choice |
| --- | --- |
| User `transfer` | blocked |
| `issue` / treasury payout | decide explicitly; document it |
| Unpause itself | must **not** require the paused admin path |

A pause that also blocks the recovery action is the deadlock this lab exists to avoid.

## Common mistakes

1. Only admin can unpause.
2. Pause stacked twice without `already paused`.
3. Stranger can clear a halt you still need.
4. One `transferGate` in tests, but `retire` / `payout` in the real contract never calls it.
5. Treating the string `eosio.msig` as a completed proposal.

## Nice-to-have extensions (not in this repo)

| Idea | Note |
| --- | --- |
| Timelock unpause | Delay after msig so holders can exit a social layer |
| Per-action flags | Pause transfers but not claims |
| Guardian set | N-of-M admins may pause; only msig unpauses |
| Event log | So indexers show "paused" without reading a table guess |

## Pairing

- Balances: [token ledger](https://github.com/pixel-journey/px-token-balance-ledger)
- Config changes: [fee splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter)
- Rates: [dex tax](https://github.com/pixel-journey/px-token-dex-differentiated-tax)

Official multisig context: [eosio.msig](https://github.com/eosio/eosio.contracts) · [docs.wax.io](https://docs.wax.io/).
