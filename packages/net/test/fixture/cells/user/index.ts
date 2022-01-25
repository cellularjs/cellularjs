import { Cell } from '../../../../src';
import { JwtModule } from '../../pkg/jwt/jwt.module';
import { CreateProfile } from './events/create-profile.event';
import { DelegateCacheHtml } from './events/delegate-cache-html.event';
import { DelegateSignIn } from './events/delegate-sign-in.evenet';
import { RenderHTML } from './helpers/render-html.helper';

@Cell({
  providers: ['./services', RenderHTML],
  imports: [JwtModule],
  listen: { CreateProfile, DelegateCacheHtml, DelegateSignIn },
})
export class UserCell {}
