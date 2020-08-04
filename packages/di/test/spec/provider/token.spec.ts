import "mocha";
import { expect } from "chai";
import { Container, DiErrorCode } from "../../../src";
import { MongoService } from "../../fixture/pkg/mongo/mongo.service";

let container: Container;

beforeEach(() => {
  container = new Container();
});

describe("Provider - token: unique identifier for provider inside a container", () => {
  it("can be a string", () => {
    container.addProvider({ token: "foo", useValue: "bar" });

    expect(container.resolve("foo")).to.equal("bar");
  });

  it("can be a number", () => {
    container.addProvider({ token: 1, useValue: "foo" });
    container.addProvider({ token: 1.1, useValue: "bar" });

    expect(container.resolve(1)).to.equal("foo");
    expect(container.resolve(1.1)).to.equal("bar");
  });

  it("can be an object", () => {
    const foo = {}, bar = {};
    container.addProviders([
      { token: foo, useValue: "foo" },
      { token: bar, useValue: "bar" },
    ]);

    expect(container.resolve(foo)).to.equal("foo");
    expect(container.resolve(bar)).to.equal("bar");
  });

  it("can be a Symbol", () => {
    const symToken = Symbol();
    container.addProvider({ token: symToken, useValue: "bar" });

    const actualResult = container.resolve(symToken);
    expect(actualResult).to.equal("bar");
  });

  it("can be a class", () => {
    container.addProvider({ token: MongoService, useValue: "foo" });

    const actualResult = container.resolve(MongoService);

    expect(actualResult).to.equal("foo");
  });

  it("can not be duplicated", () => {
    container.addProvider({ token: "foo", useValue: "foo" });

    try {
      container.addProvider({ token: "foo", useValue: "bar" });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(DiErrorCode.DuplicateToken);
    }
  });
});