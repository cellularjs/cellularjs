import { Injectable } from "@cellularjs/di";
import { CellContext } from "../../../src";
import { JwtService } from "../pkg/jwt/jwt.service";

@Injectable()
export class CustomContext extends CellContext {
  constructor(
    public jwtService: JwtService,
  ) {
    super();
  }
}