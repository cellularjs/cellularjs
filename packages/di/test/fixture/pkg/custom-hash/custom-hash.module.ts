import { Module } from "../../../../src";
import { CustomHashService } from "./custom-hash.service";

@Module({
  exports: [CustomHashService],
})
export class CustomHashModule { }