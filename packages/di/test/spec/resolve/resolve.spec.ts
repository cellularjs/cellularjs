import "mocha";
import { expect } from "chai";
import { Container, DiErrorCode } from "../../../src";
import { SharedModule } from "../../fixture/pkg/shared.module"
import { MongoService } from "../../fixture/pkg/mongo/mongo.service"
import { Connection } from "../../fixture/pkg/mongo/connection"

let container: Container;

beforeEach(() => {
  container = new Container();
});

describe("Container - resolve:", () => {
  it("can not resole value by token that is not exist", () => {
    try {
      container.resolve(123);

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(DiErrorCode.NoProviderForToken);
    }
  });
});