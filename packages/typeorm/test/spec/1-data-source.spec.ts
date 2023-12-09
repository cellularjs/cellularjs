/* eslint-disable indent */

import { assert, expect } from 'chai';
import { Entity, PrimaryColumn } from 'typeorm';
import { Container, Module } from '@cellularjs/di';
import {
  TypeOrmModule,
  destroyDataSource,
  getDataSource,
  TypeOrmError,
  TypeOrmErrorCode,
} from '../../src';
import { PG_URL } from '../config';

describe('1. DataSource', () => {
  let container: Container;

  describe('Single data source', () => {
    beforeEach(() => {
      container = new Container();
    });

    it('TypeOrmModule.initialize, initialize a data source', async () => {
      @Module({
        exports: [
          TypeOrmModule.initialize({
            type: 'postgres',
            url: PG_URL,
          }),
        ],
      })
      class CommonModule {}

      await container.addModule(CommonModule);

      expect(getDataSource().isInitialized).to.true;
    });

    it('TypeOrmModule.forFeature, can not register entity if there is no initialized data source', async () => {
      @Entity()
      class User {}

      @Module({
        exports: [
          TypeOrmModule.forFeature({
            entities: [User],
          }),
        ],
      })
      class CommonModule {}

      await assert
        .isRejected(container.addModule(CommonModule))
        .then((err: any) => {
          expect(err).to.be.instanceOf(TypeOrmError);
          expect(err.code).to.equal(TypeOrmErrorCode.NoDataSource);
        });
    });

    it('TypeOrmModule.forFeature, can not register entity if there is no initialized data source', async () => {
      @Entity()
      class User {}

      @Module({
        exports: [
          TypeOrmModule.initialize({
            type: 'postgres',
            url: PG_URL,
          }),
          TypeOrmModule.forFeature({
            source: 'not_exist',
            entities: [User],
          }),
        ],
      })
      class CommonModule {}

      await assert
        .isRejected(container.addModule(CommonModule))
        .then((err: any) => {
          expect(err).to.be.instanceOf(TypeOrmError);
          expect(err.code).to.equal(TypeOrmErrorCode.NoDataSource);
        });
    });

    it('TypeOrmModule.forFeature, register entity into the initialized data source', async () => {
      @Entity()
      class User {}

      @Module({
        exports: [
          TypeOrmModule.initialize({
            type: 'postgres',
            url: PG_URL,
          }),
          TypeOrmModule.forFeature({
            entities: [User],
          }),
        ],
      })
      class CommonModule {}

      await container.addModule(CommonModule);

      expect(getDataSource().hasMetadata(User)).to.true;
    });

    it('TypeOrmModule.initialize and TypeOrmModule.forFeature, run migration if synchronize = true', async () => {
      @Entity({ name: 'tbl_user' })
      class User {
        @PrimaryColumn()
        id: number;
      }

      @Entity({ name: 'tbl_user_registration' })
      class UserRegistration {
        @PrimaryColumn()
        id: number;
      }

      @Module({
        exports: [
          TypeOrmModule.initialize({
            type: 'postgres',
            url: PG_URL,
            synchronize: true,
          }),
          TypeOrmModule.forFeature({
            entities: [User, UserRegistration],
          }),
        ],
      })
      class CommonModule {}

      await container.addModule(CommonModule);
      const table = (
        await getDataSource().query("SELECT 'public.tbl_user'::regclass")
      )[0].regclass;

      expect(table).equal('tbl_user');
    });
  });

  describe('Multiple data sources', () => {
    beforeEach(() => {
      container = new Container();
    });

    it('TypeOrmModule.initialize, can not using duplicate source name', async () => {
      @Module({
        exports: [
          TypeOrmModule.initialize({
            type: 'postgres',
            url: PG_URL,
          }),
          TypeOrmModule.initialize({
            type: 'postgres',
            url: PG_URL,
          }),
        ],
      })
      class DuplicateDefaultSource {}

      @Module({
        exports: [
          TypeOrmModule.initialize({
            name: 'pg',
            type: 'postgres',
            url: PG_URL,
          }),
          TypeOrmModule.initialize({
            name: 'pg',
            type: 'postgres',
            url: PG_URL,
          }),
        ],
      })
      class DuplicateCustomName {}

      await assert
        .isRejected(container.addModule(DuplicateDefaultSource))
        .then((err: any) => {
          expect(err).to.be.instanceOf(TypeOrmError);
          expect(err.code).to.equal(TypeOrmErrorCode.DuplicateSourceName);
        });

      await assert
        .isRejected(container.addModule(DuplicateCustomName))
        .then((err: any) => {
          expect(err).to.be.instanceOf(TypeOrmError);
          expect(err.code).to.equal(TypeOrmErrorCode.DuplicateSourceName);
        });
    });

    it('TypeOrmModule.initialize, can initialize multiple data sources', async () => {
      @Module({
        exports: [
          TypeOrmModule.initialize({
            name: 'pg1',
            type: 'postgres',
            url: PG_URL,
          }),
          TypeOrmModule.initialize({
            name: 'pg2',
            type: 'postgres',
            url: PG_URL,
          }),
        ],
      })
      class CommonModule {}

      await container.addModule(CommonModule);

      expect(getDataSource('pg1').isInitialized).to.be.true;
      expect(getDataSource('pg2').isInitialized).to.be.true;
    });
  });

  describe('destroyDataSource()', () => {
    it('destroyDataSource, ignore if there is no data source', async () => {
      await destroyDataSource();
      await destroyDataSource('not_exist');
    });

    it('destroyDataSource, remove specific data source if it exist', async () => {
      @Module({
        exports: [
          TypeOrmModule.initialize({
            type: 'postgres',
            url: PG_URL,
          }),
          TypeOrmModule.initialize({
            name: 'pg2',
            type: 'postgres',
            url: PG_URL,
          }),
        ],
      })
      class CommonModule {}

      await container.addModule(CommonModule);
      await destroyDataSource();
      await destroyDataSource('pg2');

      expect(getDataSource()).to.undefined;
      expect(getDataSource('pg2')).to.undefined;
    });
  });
});
