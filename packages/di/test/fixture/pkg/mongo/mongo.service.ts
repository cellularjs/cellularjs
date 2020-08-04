import { Injectable } from "../../../../src";
import { Connection } from "./connection";

@Injectable()
export class MongoService {
  constructor(
    public connection: Connection,
  ) { }

  insert(record) {
    return {
      ...record,
      id: 1,
    };
  }
}