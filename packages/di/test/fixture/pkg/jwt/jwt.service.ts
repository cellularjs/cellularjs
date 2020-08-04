import { Injectable } from "../../../../src";
import { Md2Service } from "./md2.service";
import { Md5Service } from "./md5.service";
import { Sha1Service } from "./sha1.service";
import { Sha256Service } from "./sha256.service";

@Injectable()
export class JwtService {
  constructor(
    private md2Service: Md2Service,
    private md5Service: Md5Service,
    private sha1Service: Sha1Service,
    private sha256Service: Sha256Service,
  ) { }

  verify(token) {
    if (token !== "pass") {
      return false
    }

    return true;
  }

  md2Hash(str: string) {
    return this.md2Service.hash(str);
  }

  md5Hash(str: string) {
    return this.md5Service.hash(str);
  }

  sha1Hash(str: string) {
    return this.sha1Service.hash(str);
  }

  sha256Hash(str: string) {
    return this.sha256Service.hash(str);
  }
}