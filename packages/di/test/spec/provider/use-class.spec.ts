import "mocha";
import { expect } from "chai";
import { Container } from "../../../src";

describe("Provider - class/useClass", () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  it("can resolve value from useClass provider", async () => {
    container.addProvider({
      token: Container,
      useClass: Container,
    });

    const [firstContainer, secondContainer] = await Promise.all([
      container.resolve(Container),
      container.resolve(Container),
    ]);

    expect(firstContainer).to.instanceOf(Container);
    expect(firstContainer === secondContainer).to.false;
  });

  it("can cache resolved value when using useClass provider with permanent cycle", async () => {
    container.addProvider({
      token: Container,
      useClass: Container,
      cycle: "permanent",
    });

    // TODO: could DI support permerant async provider
    const firstResolvedValue = await container.resolve(Container);
    const secondResolvedValue = await container.resolve(Container);

    expect(firstResolvedValue === secondResolvedValue).to.true;
  });

  it("can resolve class as useClass provider", async () => {
    container.addProvider(Container);

    expect(await container.resolve(Container)).to.instanceOf(Container);
  });
});