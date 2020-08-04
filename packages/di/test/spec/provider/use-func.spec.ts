import "mocha";
import { expect } from "chai";
import { Container } from "../../../src";
import { request } from "../../fixture/const/data.const";
import { CreateProfileReq } from "../../fixture/user/services/create-profile.req";

describe("Provider - useFunc", () => {
  let container: Container;

  beforeEach(() => {
    // clean static _ModuleMap
    (Container as any)._ModuleMap = new Map();

    container = new Container();
  });

  it("can resolve useFunc provider", () => {
    container.addProvider({
      token: "con",
      useFunc: () => new Container,
    });

    expect(container.resolve("con")).to.instanceOf(Container);
  });

  it("can inject dependencies when resolving useFunc provider", () => {
    container.addProviders([
      Container,
      CreateProfileReq,
      { token: request, useValue: { name: "X", age: 999 } },
    ]);

    container.addProvider({
      token: "strToken",
      useFunc: (...args) => args,
      deps: [
        CreateProfileReq,
        Container,
        new Container(),
        function nameFunc() { return "nameFunc"; },
        function () { return "anonFunc" },
        () => "arrowFunc",
        "a string",
        9999,
        99.99,
      ],
    });

    const [
      objectFromClassHasAnnotation,
      objectFromClass,
      objectFromObject,
      nameFunc,
      anonFunc,
      arrowFunc,
      string,
      number,
      float,
    ] = container.resolve("strToken");

    expect(objectFromClassHasAnnotation).to.eqls({ name: "X", age: 999 });
    expect(objectFromClass).to.instanceOf(Container);
    expect(objectFromObject).to.instanceOf(Container);
    expect(nameFunc()).to.equal("nameFunc");
    expect(anonFunc()).to.equal("anonFunc");
    expect(arrowFunc()).to.equal("arrowFunc");
    expect(string).to.equal("a string");
    expect(number).to.equal(9999);
    expect(float).to.equal(99.99);
  });

  it("can cache resolved value when using useFunc provider with permanent cycle", () => {
    container.addProvider({
      token: Container,
      useFunc: () => new Container(),
      cycle: "permanent",
    });

    const firstContainer = container.resolve(Container);
    const secondContainer = container.resolve(Container);

    expect(firstContainer === secondContainer).to.true;
  });
});