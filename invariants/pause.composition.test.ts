/**
 * Composition: live → pause → blocked transfer → msig recovery → live again.
 * Successful transfer count only advances when the gate passes.
 * Admin-loss path: msig unpauses without the admin key.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createGuard,
  pause,
  unpause,
  transferGate,
  type GuardState,
} from "./pause.ts";

type Desk = {
  guard: GuardState;
  okTransfers: number;
};

function openDesk(admin: string): Desk {
  return { guard: createGuard(admin), okTransfers: 0 };
}

function tryTransfer(desk: Desk, from: string, to: string, amount: bigint): void {
  transferGate(desk.guard, from, to, amount);
  desk.okTransfers += 1;
}

describe("composition: emergency pause timeline", () => {
  it("live transfers, pause blocks, msig recovers, transfers resume", () => {
    const desk = openDesk("tokenadmin");
    tryTransfer(desk, "alice", "bob", 1n);
    tryTransfer(desk, "bob", "carol", 2n);
    assert.equal(desk.okTransfers, 2);

    desk.guard = pause(desk.guard, "tokenadmin");
    assert.throws(() => tryTransfer(desk, "alice", "bob", 1n), /paused/);
    assert.equal(desk.okTransfers, 2);

    // Admin key "lost": only msig recovers
    assert.throws(() => unpause(desk.guard, "alice"), /admin or msig/);
    desk.guard = unpause(desk.guard, "eosio.msig");
    tryTransfer(desk, "alice", "bob", 3n);
    assert.equal(desk.okTransfers, 3);
    assert.equal(desk.guard.paused, false);
  });

  it("admin can pause and unpause without msig", () => {
    const desk = openDesk("tokenadmin");
    desk.guard = pause(desk.guard, "tokenadmin");
    assert.throws(() => tryTransfer(desk, "alice", "bob", 1n), /paused/);
    desk.guard = unpause(desk.guard, "tokenadmin");
    tryTransfer(desk, "alice", "bob", 1n);
    assert.equal(desk.okTransfers, 1);
  });

  it("non-admin never pauses; double-pause never increments okTransfers", () => {
    const desk = openDesk("tokenadmin");
    assert.throws(() => pause(desk.guard, "alice"), /only admin may pause/);
    desk.guard = pause(desk.guard, "tokenadmin");
    assert.throws(() => pause(desk.guard, "tokenadmin"), /already paused/);
    assert.equal(desk.okTransfers, 0);
  });

  it("paused gate still enforces amount and self-transfer rules", () => {
    let g = createGuard("tokenadmin");
    g = pause(g, "tokenadmin");
    assert.throws(() => transferGate(g, "alice", "bob", 0n), /positive/);
    assert.throws(() => transferGate(g, "alice", "alice", 1n), /must differ/);
    assert.throws(() => transferGate(g, "alice", "bob", 1n), /paused/);
  });
});
