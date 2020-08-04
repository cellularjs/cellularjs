import { Injectable } from "../../../../src";
import { CreateProfileReq } from "../services/create-profile.req";
import { UserRepository } from "../services/user.repository";

@Injectable()
export class CreateProfile {
  constructor(
    private createProfileReq: CreateProfileReq,
    private userRepository: UserRepository,
  ) { }

  async handle() {
    const savedProfile = this.userRepository.createProfile(this.createProfileReq);
    return savedProfile;
  }
}