# <div align="center">@cellularjs/typeorm</div><sub>🐘</sub>

## 1. Installation
```
yarn add @cellularjs/typeorm pg
```

## 2. Supported database
`@cellularjs/typeorm` is built on top of `TypeORM`. The main purpose of this package is providing 2 convinent decorators: `Repository` and `Transaction`.

For now, these 2 decorators is only tested on **PostgreSQL** and **MySQL**. Different database may have different behaviours.

For example: 2 services(actions) with `@Transaction` decorator

```ts
import { Service } from '@cellularjs/net';
import { Transaction } from '@cellularjs/typeorm';

@Transaction()
@Service({ scope: 'publish' })
class Register {
  constructor(
    private userRepo: UserRepository,
  ) {}

  async handle() {
    await this.userRepo.save({ name: 'John Doe' });

    await send(new IRQ({ to: 'User:SaveAnotherData' }));

    throw new Error('Trigger rollback')
  }
}

@Transaction()
@Service({ scope: 'publish' })
class SaveAnotherData {
  constructor(
    private userRepo: UserRepository,
  ) {}

  async handle() {
    await this.userRepo.save({ name: 'Alice' });
  }
}
```
In this example, if you use PostgreSQL or MySQL, "Alice" will be saved, while "John Doe" won't. But if you use SQLite, all will be discarded([read more](https://github.com/typeorm/typeorm/issues/307#issuecomment-312289158))

## 3. Development
Sample test command for running test on local:
```
PG_URL=postgres://usr:pwd@localhost:5432/postgres yarn test
```