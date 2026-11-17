# Security — emergency pause guard

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Non-admin pause | refused |
| Non-admin / non-recovery unpause | refused |
| Transfers while paused | refused |
| `admin === recovery` at create | refused |
| Double pause | already paused |

Recovery is the string `eosio.msig` in tests. That is **not** a completed multisig proposal.

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Real auth | `require_auth(admin)` on pause; recovery permission satisfied by msig |
| Coverage | Wire the flag on every outflow you care about (transfer, issue, retire) |
| Deadlock | Unpause must not require the paused admin path alone |
| Logging | Indexers need an event or table row for "paused" |
| Timelock | Optional delay after msig so holders can react |

## Attack angles

1. Single key can pause and is the only unpause path (lost key = permanent freeze).
2. Pause blocks the recovery action itself.
3. Trusting action data `caller == "eosio.msig"` without permission checks.
4. Pausing transfers but leaving an unprotected payout path open.

## Honesty limits

No balances move. Related: [token ledger](https://github.com/pixel-journey/px-token-balance-ledger) · [eosio.msig](https://github.com/eosio/eosio.contracts).
