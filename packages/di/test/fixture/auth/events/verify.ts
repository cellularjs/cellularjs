import { Injectable } from "../../../../src";
import { JwtService } from "../../pkg/jwt/jwt.service";

@Injectable()
export class Verify {
  constructor(
    private jwtService: JwtService,
  ) {}

  async handle() {
    return this.jwtService.verify("pass");
  }
}