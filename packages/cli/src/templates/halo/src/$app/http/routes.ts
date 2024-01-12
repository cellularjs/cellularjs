import { proxyTo } from '$share/express-proxy';
import { Express, Router } from 'express';

export function configRoutes(app: Express) {
  //===================================================================================================
  // /api/user
  const userRouter = Router();
  userRouter.get('/', proxyTo('User:SayHelloQry'));

  app.use('/', userRouter); // app.use('/api/user', userRouter);
}
