# Education — pause without a single-key trap

> **Rung:** `npm test` passes. No balances move. `eosio.msig` is a string, not a multisig proposal.  
> **The test is the rule.**

## What you should be able to do

| Level | After this file |
| --- | --- |
| Beginner | Pause as admin, unpause as `eosio.msig`, and see a transfer fail while paused |
| Intermediate | Separate who may pause from who may unpause, and what the gate does not check |
| Masterclass | Say what a real `eosio.msig` proposal still has to be allowed to call |

---

## Beginner — one scene

`createGuard("tokenadmin")` starts unpaused. The recovery name defaults to `eosio.msig`, and it must not equal the admin.

Admin pauses. `paused` is true. `eosio.msig` unpauses. `paused` is false. The admin can also unpause. Alice cannot pause. Alice cannot unpause. Pausing twice throws `already paused`.

`transferGate` from Alice to Bob for `1n` does not throw while the guard is open. After pause, the same call throws `transfers paused`. Amount `0n` throws even when the guard is open (`amount must be a positive bigint`).

### Words

| Word | Meaning here |
| --- | --- |
| Admin | The only name allowed to pause. Also allowed to unpause |
| `eosio.msig` | The default second name allowed to unpause. Not a running multisig |
| Pause | Sets a boolean. Does not freeze a table of balances, because there is no table |
| `transferGate` | Checks names, distinct ends, positive amount, then the flag |

### Predict, then run

```bash
npm test
```

1. Can the admin pause and also be the account that unpauses? (Yes. The test does that.)
2. Does `transferGate` return a new balance? (No. It returns void. It only throws or does not.)
3. Is a paused transfer rejected before or after a zero-amount check? (Look at the source order: names, from≠to, positive amount, then the flag. The paused test uses amount `1n`, so it reaches the flag.)

---

## Intermediate — the recovery is asymmetric on purpose

`pause` refuses anyone who is not admin, and refuses a second pause.

`unpause` allows admin **or** msig, and refuses a call when the flag is already false (`not paused`). The tests do not cover `not paused`. They cover a stranger unpausing a live pause (`only admin or msig may unpause`).

`createGuard` refuses `admin === msig`. If those names were the same, "losing the admin key" and "the recovery key" would be the same loss. The tests use the default msig and never pass a custom one.

`transferGate` also refuses `from === to`. No test asserts that string. It refuses non-positive amounts. The zero test does. It does not look at a balance, a symbol, or a memo. A successful call means "the gate did not object," not "tokens moved."

### Attack → test

| Attack | Naive code | This lab | Test |
| --- | --- | --- | --- |
| Anyone freezes the token | Grief | `only admin may pause` | `non-admin cannot pause` |
| Lost admin key, only admin can unpause | Permanent freeze | `eosio.msig` may unpause | `admin pauses; msig unpauses` |
| Stranger clears the pause | They unstick a halt you still need | refused | `random account cannot unpause` |
| Pause stacked twice | Confused boolean | `already paused` | `double pause refused` |
| Transfer during halt | Drain continues | `transfers paused` | `blocks transfer when paused` |
| Zero-amount transfer while open | Junk notify | positive amount | `refuses zero amount` |

---

## Masterclass — `eosio.msig` only helps if it can satisfy `require_auth`

This lab treats the caller string `"eosio.msig"` as the recovery authority. On chain that string does nothing unless the unpause action's authority is one a multisig proposal can satisfy.

What you still have to design:

- `pause` is `require_auth(admin)`.
- `unpause` is `require_auth(admin)` **or** `require_auth` of an account whose active permission is an `eosio.msig` approval threshold (often a second permission, not a hardcoded name check).
- The admin key must not be the only key on that recovery permission. Otherwise the test's story is false.
- Contract code that checks `caller == "eosio.msig"` inside action data is bypassable: the user sets the field. The tests pass the field. Production must not copy that shape.
- Pause has to sit on every outflow you care about: user `transfer`, and also any admin `issue` or treasury `payout` you forgot. This gate is one function. Nothing calls it except the test.
- A pause that blocks `eosio.msig` itself from doing the unpause inline is the deadlock this quest exists to avoid. Do not require the admin permission inside `unpause`.

Issuer, max supply, and balances are a different lab. A green pause test plus no ledger is still not a token.

### Exercise

1. `createGuard("eosio.msig")` with the default msig. What happens? (Throws `admin and msig must differ`. Derived. No test.)
2. Unpause when already unpaused. What error? (`not paused`. Source. No test.)
3. Write the one sentence this course forbids. ("Calling unpause as the string eosio.msig is a multisig proposal.")

---

## What this course will not teach

- How to propose an `eosio.msig` transaction
- A balance that the gate would debit
- That every token action in a larger contract is covered (only `transferGate` looks at the flag)
