import { Injectable, Inject } from "../../../../src";
import { request, dummyAccessToken } from "../../const/data.const"

@Injectable()
export class UserService {
  email = 'foo@bar.com';

  constructor(
    @Inject(request) req,
  ) {
    if (req.token !== dummyAccessToken) {
      throw new Error('401');
    }
  }
}