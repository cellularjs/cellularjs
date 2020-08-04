import "mocha";
import { expect } from "chai";
import { Container } from "../../../src";
import { JwtModule } from "../../fixture/pkg/jwt/jwt.module";
import { JwtService } from "../../fixture/pkg/jwt/jwt.service";
import { MongoService } from "../../fixture/pkg/mongo/mongo.service";

describe("Utility - has(): check if provider exists", () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  it("can check if provider exists in container", () => {
    container.addModule(JwtModule);

    expect(container.has(JwtService)).to.true;
    expect(container.has(MongoService)).to.false;
  });
});