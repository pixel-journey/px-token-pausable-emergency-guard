# Worked examples — emergency pause

Admin `tokenadmin`, msig `eosio.msig`. Admin and msig **must differ** at create.

## Roles

| Action | Who |
| --- | --- |
| pause | admin only |
| unpause | admin **or** msig |

Alice cannot pause or unpause. Double pause → `already paused`. Unpause while live → `not paused`.

## transferGate

Live: alice→bob ok. Paused: throws `paused`. Zero amount and self-transfer still refused even when paused (`positive` / `must differ`).

## Composition timeline

1. Two live transfers → `okTransfers` 2.
2. Pause → third transfer blocked; count stays 2.
3. Alice cannot unpause; `eosio.msig` can.
4. Transfer resumes; count 3; `paused` false.

Admin alone can also unpause. Non-admin never pauses; double-pause never increments success count.

No token balances in this lab — only the gate.
