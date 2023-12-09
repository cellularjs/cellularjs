import { QueryRunner as TypeOrmQueryRunner } from 'typeorm';

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface QueryRunner extends TypeOrmQueryRunner {}

/**
 * `@cellularjs/typeorm`'s query runner. It is mainly used as a token for
 * resolving the appropriate query runner instance.
 */
export class QueryRunner {}

export type Entity = { new (...args: unknown[]): unknown };

/**
 * Data source name
 */
export type SourceName = string | symbol;
