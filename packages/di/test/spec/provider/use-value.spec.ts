import "mocha";
import { expect } from "chai";
import { Container } from "../../../src";

describe("Provider - useValue", () => {
  it("can pass any type of value to useValue provider", async () => {
    const container = new Container();
    container.addProviders([
      { token: "string", useValue: "string" },
      { token: "number", useValue: 99 },
      { token: "object", useValue: { foo: "bar"} },
    ]);

    expect(await container.resolve("string")).to.equal("string");
    expect(await container.resolve("number")).to.equal(99);
    expect(await container.resolve("object")).to.eqls({ foo: "bar"});
  });
});