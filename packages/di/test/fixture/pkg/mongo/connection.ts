import { Inject, Injectable } from "../../../../src";

@Injectable()
export class Connection {
  constructor(
    @Inject("mongoUrl") public mongoUrl,
    @Inject("mongoUsr") public mongoUsr,
    @Inject("mongoPwd") public mongoPwd,
  ) { }
}