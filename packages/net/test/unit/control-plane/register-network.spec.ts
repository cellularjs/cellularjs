import "mocha";
import { expect } from "chai";
import { ControlPlane } from "../../../src";

describe("ControlPlane - registerNetwork(): register network into control plane", () => {

  beforeEach(() => {
    (ControlPlane as any)._Resolved_Cells = new Map();
  });

  it("abc", () => {
    expect('neverland').to.equal("neverland");
  });
});