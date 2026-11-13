# Worked examples — pausable guard

## Example A — admin pause

```text
createGuard("admin.acc", "eosio.msig")
pause(admin) → paused true
transferGate(...) → "transfers paused"
```

## Example B — admin unpause

unpause(admin) → paused false; transferGate allows positive amount to different account.

## Example C — msig recovery

Admin key “lost”: unpause(`eosio.msig`) succeeds. Stranger cannot unpause.

## Example D — idempotent errors

Double pause → already paused. Unpause when live → not paused.

## Example E — composition lifecycle

Live → pause → refuse transfer → msig unpause → transfer ok → admin pause again.
