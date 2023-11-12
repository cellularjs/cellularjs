import { QueryRunner as TypeOrmQueryRunner } from 'typeorm';

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface QueryRunner extends TypeOrmQueryRunner {}
export class QueryRunner {}

export type Entity = { new (...args: any[]): any };
