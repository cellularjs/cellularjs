import { Inject, Injectable } from "../../../../src";
import { request } from "../../const/data.const";

@Injectable()
export class CreateProfileReq {
  readonly name;
  readonly age;

  constructor(
    @Inject(request) req,
  ) {
    Object.assign(this, req);
  }
}