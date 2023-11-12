import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Repository as TypeOrmRepository,
} from 'typeorm';
import { Container, Module } from '@cellularjs/di';
import { Repository, TypeOrmModule, getDataSource } from '../../../src';

// ./user.data.ts
@Entity()
class UserEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column() name: string;
}

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
interface UserRepository extends TypeOrmRepository<UserEntity> {}

@Repository(UserEntity)
class UserRepository {}

// ./common.module.ts
@Module({
  exports: [
    TypeOrmModule.initialize({
      type: 'better-sqlite3',
      database: ':memory:',
    }),
  ],
})
class CommonModule {}

//
export async function getUserRepository() {
  const container = new Container();

  await container.addProvider(UserRepository);
  await container.addModule(CommonModule);
  await container.addModule(TypeOrmModule.forFeature([UserEntity]));
  await getDataSource().synchronize();

  return container.resolve<UserRepository>(UserRepository);
}
