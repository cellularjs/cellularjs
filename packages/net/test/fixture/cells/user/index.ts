import { Cell } from '../../../../src';
import { CustomContext } from '../../share/custom-context';
import { JwtModule } from '../../pkg/jwt/jwt.module';
import { CreateProfile } from './events/create-profile.event';
import { DelegateCacheHtml } from './events/delegate-cache-html.event';
import { DelegateSignIn } from './events/delegate-sign-in.evenet';
import { SendMail } from './events/send-mail.event';
import { RenderHTML } from './helpers/render-html.helper';

@Cell({
  context: CustomContext,
  providers: [
    './services',
    RenderHTML,
  ],
  imports: [JwtModule],
  listen: { CreateProfile, DelegateCacheHtml, DelegateSignIn, SendMail },
})
export class UserCell { }