# Worked examples — pausable transfer gate

Admin `tokenadmin`, default msig `eosio.msig`. Admin and msig **must differ** on create.

## Pause / unpause

| Actor | Action | Result |
| --- | --- | --- |
| tokenadmin | pause | paused true |
| eosio.msig | unpause | paused false |
| tokenadmin | unpause | also allowed |
| alice | pause | only admin may pause |
| alice | unpause | admin or msig |
| tokenadmin | pause twice | already paused |
| tokenadmin | unpause while live | not paused |

## transferGate

Live: alice→bob amount 1 ok. Paused: throws `paused`. Amount 0 → positive. Self-transfer → must differ.

## Composition timeline

1. Two live transfers → `okTransfers` 2.
2. Pause → further transfer refused; count stays 2.
3. Alice cannot unpause; **eosio.msig** unpauses.
4. Third transfer succeeds; paused false.

Admin-only pause/unpause path also works without msig. Failed pauses never increment `okTransfers`.

No token balances in this lab — only the emergency gate.
