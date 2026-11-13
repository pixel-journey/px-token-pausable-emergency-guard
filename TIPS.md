# Tips — emergency pause

- **Never** make admin the only unpause authority without a multisig (or timelock) escape hatch.
- Pause should block **user** transfers; decide explicitly whether admin/issuer paths still work.
- Wire `assertTransferAllowed` at every entry that moves balances.
- Document who holds `admin` and who controls `eosio.msig` proposals on WAX.

Related: token ledger, fee splitter admin, treasury setconfig.
