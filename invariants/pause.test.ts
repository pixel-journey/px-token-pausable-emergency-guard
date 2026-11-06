import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createGuard,
  pause,
  unpause,
  transferGate,
} from "./pause.ts";

describe("createGuard", () => {
  it("starts unpaused", () => {
    const g = createGuard("tokenadmin");
    assert.equal(g.paused, false);
    assert.equal(g.msig, "eosio.msig");
  });

  it("refuses admin equal to msig", () => {
    assert.throws(
      () => createGuard("eosio.msig", "eosio.msig"),
      /admin and msig must differ/,
    );
  });
});

describe("pause / unpause", () => {
  it("admin pauses; msig unpauses", () => {
    let g = createGuard("tokenadmin");
    g = pause(g, "tokenadmin");
    assert.equal(g.paused, true);
    g = unpause(g, "eosio.msig");
    assert.equal(g.paused, false);
  });

  it("admin can also unpause", () => {
    let g = createGuard("tokenadmin");
    g = pause(g, "tokenadmin");
    g = unpause(g, "tokenadmin");
    assert.equal(g.paused, false);
  });

  it("non-admin cannot pause", () => {
    const g = createGuard("tokenadmin");
    assert.throws(() => pause(g, "alice"), /only admin may pause/);
  });

  it("random account cannot unpause", () => {
    let g = createGuard("tokenadmin");
    g = pause(g, "tokenadmin");
    assert.throws(() => unpause(g, "alice"), /admin or msig/);
  });

  it("double pause refused", () => {
    let g = createGuard("tokenadmin");
    g = pause(g, "tokenadmin");
    assert.throws(() => pause(g, "tokenadmin"), /already paused/);
  });

  it("unpause while live is refused", () => {
    const g = createGuard("tokenadmin");
    assert.throws(() => unpause(g, "tokenadmin"), /not paused/);
  });
});

describe("transferGate", () => {
  it("allows transfer when not paused", () => {
    const g = createGuard("tokenadmin");
    assert.doesNotThrow(() => transferGate(g, "alice", "bob", 1n));
  });

  it("blocks transfer when paused", () => {
    let g = createGuard("tokenadmin");
    g = pause(g, "tokenadmin");
    assert.throws(() => transferGate(g, "alice", "bob", 1n), /paused/);
  });

  it("refuses zero amount", () => {
    const g = createGuard("tokenadmin");
    assert.throws(() => transferGate(g, "alice", "bob", 0n), /positive/);
  });

  it("refuses from equal to to", () => {
    const g = createGuard("tokenadmin");
    assert.throws(() => transferGate(g, "alice", "alice", 1n), /must differ/);
  });
});
