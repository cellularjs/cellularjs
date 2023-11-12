import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Repository as TypeOrmRepository,
} from 'typeorm';
import { Module } from '@cellularjs/di';
import {
  Cell,
  IRQ,
  Service,
  ServiceHandler,
  createNetWork,
  send,
} from '@cellularjs/net';
import { Repository, Transactional, TypeOrmModule } from '../../../src';
import { PG_URL } from '../../config';

// ./user.data.ts
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column() name: string;
}

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface UserRepository extends TypeOrmRepository<UserEntity> {}

@Repository(UserEntity)
export class UserRepository {}

// ./common.module.ts
@Module({
  exports: [
    TypeOrmModule.initialize({
      url: PG_URL,
      type: 'postgres',
      synchronize: true,
    }),
  ],
})
class CommonModule {}

// ./register.cmd.ts
@Transactional()
@Service({ scope: 'publish' })
class RegisterCmd implements ServiceHandler {
  constructor(private irq: IRQ, private userRepo: UserRepository) {}

  async handle() {
    await this.userRepo.save({ name: 'John Doe I' });

    const newUser = await send(new IRQ({ to: 'User:SaveSomethingCmd' }));

    console.log('newUser, ', newUser);
    if (this.irq.body.shouldThrow) {
      throw new Error('Throw on-purpose');
    }
  }
}

@Transactional()
@Service({ scope: 'publish' })
class SaveSomethingCmd implements ServiceHandler {
  constructor(private userRepo: UserRepository) {}

  async handle() {
    console.log('SaveSomethingCmd');
    return await this.userRepo.save({ name: 'John Doe II' });
  }
}

// ./user.cell.ts
@Cell({
  providers: [UserRepository],
  imports: [CommonModule, TypeOrmModule.forFeature([UserEntity])],
  listen: { RegisterCmd, SaveSomethingCmd },
})
class User {}

//
export async function getUserRepository() {
  await createNetWork([{ name: User.name, driver: User }]);
}
