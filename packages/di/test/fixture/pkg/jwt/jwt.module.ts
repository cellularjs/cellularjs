import { Module } from "../../../../src";
import { CustomHashModule } from "../custom-hash/custom-hash.module";
import { JwtService } from "./jwt.service";
import { Md2Service } from "./md2.service";
import { Md5Service } from "./md5.service";
import { Sha1Service } from "./sha1.service";
import { Sha256Service } from "./sha256.service";
import { JwtSignService } from "./jwt-sign.service";

@Module({
  providers: [
    Md5Service,
    { token: Md2Service, useValue: new Md2Service() },
    { token: Sha1Service, useClass: Sha1Service },
    { token: Sha256Service, useFunc: async () => new Sha256Service() },
  ],
  exports: [JwtService],
})
export class JwtModule {
  static withSignService() {
    return {
      extModule: JwtModule,
      imports: [CustomHashModule],
      exports: [JwtSignService],
    }
  }
}