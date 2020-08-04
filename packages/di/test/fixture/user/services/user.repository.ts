import { Injectable } from "../../../../src";
import { MongoService } from "../../pkg/mongo/mongo.service";
import { CreateProfileReq } from "./create-profile.req";

@Injectable()
export class UserRepository {
  constructor(
    public mongoService: MongoService,
  ) { }

  createProfile(createProfileReq: CreateProfileReq) {
    return this.mongoService.insert(createProfileReq);
  }
}