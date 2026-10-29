import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createGuard,
  pause,
  unpause,
  transferGate,
} from "./pause.ts";

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
});
