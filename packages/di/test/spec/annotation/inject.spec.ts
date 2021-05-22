import "mocha";
import { expect } from "chai";
import { Container } from "../../../src";
import { request } from "../../fixture/const/data.const";
import { CreateProfileReq } from "../../fixture/user/services/create-profile.req";
import { UserRepository } from "../../fixture/user/services/user.repository";
import { Connection } from "../../fixture/pkg/mongo/connection";
import { MongoService } from "../../fixture/pkg/mongo/mongo.service";

describe("Annotation - Inject(): inject dependency base on token", () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  it("can use string as token", async () => {
    container.addProviders([
      Connection,
      { token: "mongoUrl", useValue: "neverland" },
      { token: "mongoUsr", useValue: "guest" },
      { token: "mongoPwd", useValue: "**********" },
    ]);

    const conn = await container.resolve<Connection>(Connection);

    expect(conn.mongoUrl).to.equal("neverland");
    expect(conn.mongoUsr).to.equal("guest");
    expect(conn.mongoPwd).to.equal("**********");
  });

  it("can use Symbol as token", async () => {
    const mockReq = { name: "X", age: 99 };
    container.addProviders([
      CreateProfileReq,
      { token: request, useValue: mockReq }
    ]);

    const createPostReq = await container.resolve(CreateProfileReq);

    expect(createPostReq).to.eqls(mockReq);
  });

  it("can use class as token", async () => {
    container.addProviders([
      UserRepository,
      { token: MongoService, useValue: "foobar" },
    ]);

    const postRepository = await container.resolve<UserRepository>(UserRepository);

    expect(postRepository.mongoService).to.equal("foobar");
  });

  it("have higher priority than type hint", async () => {
    container.addProviders([
      UserRepository,
      { token: MongoService, useValue: "foobar" },
    ]);

    const postRepository = await container.resolve<UserRepository>(UserRepository);

    expect(postRepository.mongoService instanceof MongoService).to.false;
  });
});