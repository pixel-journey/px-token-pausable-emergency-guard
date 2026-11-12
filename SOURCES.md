# Official sources

| Source | Use |
| --- | --- |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | Permissions, `require_auth`, msig model |
| [docs.wax.io](https://docs.wax.io/) | WAX development |
| [eosio.msig](https://github.com/eosio/eosio.contracts) | Multisig proposal pattern (reference) |
| Production mirror | [wax-contract-compiler `pxguard`](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxguard) — [run 24](https://github.com/pixel-journey/wax-contract-compiler/actions/runs/42821960554) |

Naming `eosio.msig` in tests is **not** executing a multisig proposal.

## Domain map

| Repo | Role |
| --- | --- |
| **This repo** | Pause/unpause + transfer gate (TS) |
| [pxguard wasm](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxguard) | C++ production compile of the guard |
| [px-token-balance-ledger](https://github.com/pixel-journey/px-token-balance-ledger) | Ledger under the gate |
