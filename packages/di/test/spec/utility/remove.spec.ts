import "mocha";
import { expect } from "chai";
import { Container } from "../../../src";

describe("Utility - remove():", () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  it("can remove provider from container by given token", () => {
    container.addProvider({ token: 'foo', useValue: 'bar' });

    expect(container.has('foo')).to.true;
    container.remove('foo');
    expect(container.has('foo')).to.false;
  });
});
