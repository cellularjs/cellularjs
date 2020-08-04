import { Module, ExtModuleMeta } from "../../../../src";
import { Connection } from "./connection";
import { MongoService } from "./mongo.service";

@Module({
  providers: [Connection],
  exports: [
    MongoService,
  ],
})
export class MongoModule {
  static config({ mongoUrl, user, password }): ExtModuleMeta {
    return {
      extModule: MongoModule,
      providers: [
        { token: "mongoUrl", useValue: mongoUrl },
        { token: "mongoUsr", useValue: user },
        { token: "mongoPwd", useValue: password },
      ],
    };
  }
}