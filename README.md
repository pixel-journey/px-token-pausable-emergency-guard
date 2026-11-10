# Pause is tight. Unpause is not a single key.

> **Trust:** private educational lab (Tier B)  
> **Quest:** 111 — pausable emergency guard  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach a **pause switch** for transfers where **only admin pauses**, and **admin or `eosio.msig` unpauses**, so recovery is not a single-key deadlock.

**Real code:** `npm test`. **Not** a full token, **not** wasm in this repo, **not** a live msig proposal.

**Production mirror (C++ → wasm):** [wax-contract-compiler `pxguard`](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxguard) — [run 24](https://github.com/pixel-journey/wax-contract-compiler/actions/runs/42821960554), wasm SHA256 `da54a7088823f5f0a6edc0a690c64b825efc4739253da636806997677f7b6f6a`, audit 0 errors / 0 warnings. **Not deployed.**

## What you can learn

- Why pause authority and unpause authority should not be the same single key.
- Why a second pause is an error, not a no-op that hides a stuck flag.
- Why the transfer gate fails closed while paused, and still refuses a zero amount when live.
- Why naming `eosio.msig` in this file is not the same as executing a multisig proposal.

## What is actually in the repo

| Piece | Role |
| --- | --- |
| `invariants/pause.ts` | `createGuard`, `pause`, `unpause`, `transferGate` |
| `invariants/pause.test.ts` | Executed claims |
| `EDUCATION.md` | Why unpause is the part teams get wrong |
| `SECURITY.md` | What a real contract still has to authorize |

## What is true (executed)

Default msig account is `eosio.msig`. Admin and msig must be different names.

| Rule | Result |
| --- | --- |
| Admin `tokenadmin` pauses | `paused: true` |
| `eosio.msig` unpauses | `paused: false` |
| Admin unpauses after admin pause | `paused: false` |
| Non-admin pause | `only admin may pause` |
| Random account unpause | `only admin or msig may unpause` |
| Second pause | `already paused` |
| Transfer while live, amount `1n` | allowed (gate only; no balances) |
| Transfer while paused | `transfers paused` |
| Transfer amount `0n` | refused even when not paused |

## The rule, in order

1. `createGuard(admin, msig = "eosio.msig")` checks both names and refuses `admin === msig`. Starts unpaused.
2. `pause` succeeds only for `admin`, and only when the flag is false.
3. `unpause` succeeds for `admin` or `msig`, and only when the flag is true.
4. `transferGate` requires distinct `from` and `to`, a positive `bigint` amount, and an unpaused state. It does not move a balance.

```ts
import { createGuard, pause, transferGate, unpause } from "./invariants/pause.ts";

let guard = createGuard("tokenadmin");
guard = pause(guard, "tokenadmin");
// transferGate(guard, "alice", "bob", 1n) throws
guard = unpause(guard, "eosio.msig");
```

## Edge cases

- Unpause while already live throws `not paused`.
- `from === to` throws before the pause check matters.
- A non-positive amount throws `amount must be a positive bigint`.
- Account-name checks are a format check, not a proof the account exists.
- This gate does not cover issue or retire. A production pause policy has to say which actions it covers.

## Best practice and the opposite

**Do** keep pause tighter than unpause.  
**Do** leave a documented recovery account (`eosio.msig` here) that is not the same key as admin.

**Do not** treat a passing `transferGate` as a token transfer. There is no ledger.  
**Do not** describe this as an executed multisig. The string `eosio.msig` is an allowed caller in memory.

## Live path, not shipped

```
admin pause / admin-or-msig unpause     [tested in memory]
    → require_auth on those actions       [C++ mirror: pxguard]
    → eosio.msig proposal execution        [not in this repo]
    → transfer that also checks balances   [not in this repo]
```

See [SECURITY.md](SECURITY.md) and [EDUCATION.md](EDUCATION.md).

## Related

- Production compile: [wax-contract-compiler / pxguard](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxguard)
- Template note: `PAUSE-RECOVERY.md` on `px-antelope-contract-template`
- Vault index: `px-contract-examples-vault`

## Run

```bash
npm test
```

MIT — Pixel Journey
