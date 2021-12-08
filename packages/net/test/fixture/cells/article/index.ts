import { Cell } from '../../../../src';
import { DatabaseModule } from '../../pkg/database/database.module';

@Cell({
  imports: [
    DatabaseModule.config({
      host: 'localhost',
      user: 'user',
      password: '#####',
      poolSize: 3,
    }),
  ],
  listen: './services',
})
export class ArticleCell { }