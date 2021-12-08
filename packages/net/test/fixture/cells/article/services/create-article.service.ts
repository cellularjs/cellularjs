import { Service } from '@cellularjs/net';
import { Session, Transaction } from '../../../pkg/database'

@Transaction()
@Service({ scope: 'publish' })
export class CreateArticle {
  constructor(
    public session: Session,
  ) { }

  handle() { }
}