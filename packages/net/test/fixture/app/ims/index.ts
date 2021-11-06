import { Cell } from '../../../../src';
import { JwtModule } from '../../pkg/jwt/jwt.module';
import { CacheHtml } from './events/cache-html.event';
import { DelegateSendMail } from './events/delegate-send-mail.event';
import { DelegateUnlockAccount } from './events/delegate-unlock-account.event';
import { RenderHtml } from './events/render-html.event';

@Cell({
  imports: [JwtModule],
  listen: { CacheHtml, DelegateSendMail, DelegateUnlockAccount, RenderHtml },
})
export class IMSCell { }