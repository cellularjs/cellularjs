# <div align="center">@cellularjs/express-proxy</div><sub>🐘</sub>

_(For more information, please visit https://cellularjs.com/docs/how-to%20wiki/env%20variable)_

## 1. Example
**Example 1:** create a proxy for JSON api.
```ts
// $share/express-proxy/index.ts
import { expressProxy, InputTransform, OutputTransform  } from '@cellularjs/express-proxy';

const inputTransform: InputTransform = (req, proxyTo) => {
  return new IRQ(
    { to: proxyTo },
    { ...req.query, ...req.params, ...req.body },
  );
}

const outputTransform: OutputTransform = (expressCtx, cellularCtx) => {
  const { res } = expressCtx;
  const { irs } = cellularCtx;

  res
    .status(irs.header.status)
    .json(irs.body);
}

export const proxyTo = expressProxy(
  { inputTransform, outputTransform },
  localTransporter,
);
```

```ts
// iam/$gateway/http/index.ts
import { Router } from 'express';
import { proxyTo } from '$share/express-proxy';

export const iamRouter = Router();

iamRouter.post('/groups/add-user-to-group', proxyTo('IAM:AddUserToGroup'));
```

**Example 2:** override base proxy config for individual endpoint.
```ts
// iam/$gateway/http/index.ts
import { Router } from 'express';
import { proxyTo } from '$share/express-proxy';

export const iamRouter = Router();

iamRouter.get('/users', proxyTo('IAM:ListUsers', {
  outputTransform: (expressCtx, cellularCtx) => {
    const { res } = expressCtx;
    const { irs } = cellularCtx;

    res.send(`<pre>${JSON.stringify(irs.body)}</pre>`);
  },
}));
```