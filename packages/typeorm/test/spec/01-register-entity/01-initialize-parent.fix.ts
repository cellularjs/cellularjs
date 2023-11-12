import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Container } from '@cellularjs/di';
import { TypeOrmModule } from '../../../src';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column() name: string;
}

//
export async function getUserRepository() {
  const container = new Container();
  await container.addModule(TypeOrmModule.forFeature([UserEntity]));
}
