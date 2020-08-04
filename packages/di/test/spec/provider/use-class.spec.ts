import "mocha";
import { expect } from "chai";
import { Container } from "../../../src";

describe("Provider - class/useClass", () => {
  let container: Container;

  beforeEach(() => {
    // clean static _ModuleMap
    (Container as any)._ModuleMap = new Map();

    container = new Container();
  });

  it("can resolve value from useClass provider", () => {
    container.addProvider({
      token: Container,
      useClass: Container,
    });

    const firstContainer = container.resolve(Container);
    const secondContainer = container.resolve(Container);

    expect(firstContainer).to.instanceOf(Container);
    expect(firstContainer === secondContainer).to.false;
  });

  it("can cache resolved value when using useClass provider with permanent cycle", () => {
    container.addProvider({
      token: Container,
      useClass: Container,
      cycle: "permanent",
    });

    const firstResolvedValue = container.resolve(Container);
    const secondResolvedValue = container.resolve(Container);

    expect(firstResolvedValue === secondResolvedValue).to.true;
  });

  it("can resolve class as useClass provider", () => {
    container.addProvider(Container);

    expect(container.resolve(Container)).to.instanceOf(Container);
  });
});