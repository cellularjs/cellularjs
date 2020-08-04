import "mocha";
import { expect } from "chai";
import { Container, DiErrorCode } from "../../../src";

let container: Container;

beforeEach(() => {
  container = new Container();
});

describe("Utility - resolve:", () => {
  it("can not resole value by token that is not exist", () => {
    try {
      container.resolve(123);

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(DiErrorCode.NoProviderForToken);
    }
  });
});