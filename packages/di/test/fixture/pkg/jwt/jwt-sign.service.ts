import { Injectable } from "../../../../src";
import { CustomHashService } from "../custom-hash/custom-hash.service";
import { JwtService } from "./jwt.service";
import { Md5Service } from "./md5.service";

@Injectable()
export class JwtSignService {
  constructor(
    public customHashService: CustomHashService,
    public jwtService: JwtService,
    public md5Service: Md5Service,
  ) { }

  sign(str: string) {
    return this.customHashService.hash(str);
  }
}