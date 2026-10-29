/**
 * Pausable transfer guard (educational).
 * Admin may pause. Admin or eosio.msig may unpause.
 * Transfers refuse while paused. No single-key deadlock on recovery.
 */

export type GuardState = {
  admin: string;
  msig: string;
  paused: boolean;
};

const NAME = /^[a-z1-5.]{1,12}$/;

export function assertName(name: string): string {
  if (!NAME.test(name) || name.startsWith(".") || name.endsWith(".")) {
    throw new Error("bad account name");
  }
  return name;
}

export function createGuard(admin: string, msig = "eosio.msig"): GuardState {
  assertName(admin);
  assertName(msig);
  if (admin === msig) throw new Error("admin and msig must differ");
  return { admin, msig, paused: false };
}

/** Only admin may pause. */
export function pause(state: GuardState, caller: string): GuardState {
  assertName(caller);
  if (caller !== state.admin) throw new Error("only admin may pause");
  if (state.paused) throw new Error("already paused");
  return { ...state, paused: true };
}

/** Admin or msig may unpause — recovery path if admin key is lost. */
export function unpause(state: GuardState, caller: string): GuardState {
  assertName(caller);
  if (caller !== state.admin && caller !== state.msig) {
    throw new Error("only admin or msig may unpause");
  }
  if (!state.paused) throw new Error("not paused");
  return { ...state, paused: false };
}

/** Transfers blocked while paused. */
export function assertTransferAllowed(state: GuardState): void {
  if (state.paused) throw new Error("transfers paused");
}

/**
 * Educational transfer gate: positive amount + not paused.
 * Not a full balance ledger.
 */
export function transferGate(
  state: GuardState,
  from: string,
  to: string,
  amount: bigint
): void {
  assertName(from);
  assertName(to);
  if (from === to) throw new Error("from and to must differ");
  if (typeof amount !== "bigint" || amount <= 0n) {
    throw new Error("amount must be a positive bigint");
  }
  assertTransferAllowed(state);
}
