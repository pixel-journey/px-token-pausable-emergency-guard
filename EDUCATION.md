# Education

Emergency pause is useful; **unpause authority** is the part teams get wrong.

If only a single admin key can unpause, loss of that key freezes the token forever. This lab encodes:

- **Pause:** admin only (tight)
- **Unpause:** admin **or** `eosio.msig` (recoverable)

Transfers consult the flag and fail closed while paused.

Aligns with template `PAUSE-RECOVERY.md` and vault rule: pause switches leave an msig recovery path.
