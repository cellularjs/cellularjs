# <div align="center">CellularJS/Net</div><div align="center"><sub>Programmatic network</sub></div><sub>🐘</sub>

## 1. About
Net is a component of CellularJS. It create a programmatic network where cell(same as service) can communicate with each others via a message flow. It use concept of "space" to relatively specify cell location and use appropriate driver for communication.

With the help of programmatic network, your services will become protocol-agnostic. No matter the driver use function call, HTTP, or AMQP, you will get the same message and your domain logic will be safe from protocol chaos. As a result, you can break your services up into multiple physical isolation services more easily.

By xxx, it make use of inversion of control to make things more beautifull.

## 2. Get started
```
npm install @cellularjs/net
```

@cellularjs/net was built on top of typescript. You need to enable typescript decorator to use this package. Add `experimentalDecorators`, `emitDecoratorMetadata` to your existed tsconfig.json.
```json
{
  "compilerOptions": {
    ...
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    ...
  }
}
```
## 3. Examples


## 4. API
### 4.1. Annotation/Decorator
```ts
/**
 * Decorate cell with meta data.
 */
@Cell(cellConfig: CellConfig)
```

```ts
/**
 * Mark class as event handler.
 */
@Service()
```

### 4.2. ControlPlane methods
```ts
/**
 * 
 */
static async registerNetwork(networkConfig: NetworkConfig): Promise<void>;
```

```ts
/**
 * 
 */
static getResolvedCell(cellName: string): ResolvedCell | undefined;
```

### 4.3. Transportor methods
```ts
/**
 * Send Internal Request and get Internal Response.
 */
static send(irq: CellularIRQ): Promise<CellularIRS>;
```

### 4.4. Types
**`CellConfig`:**
| Name      | Type                                    | Required | Default |
|:----------|:----------------------------------------|:---------|:--------|
| providers | GenericProvider[]                       | False    |         |
| imports   | ImportableCnf[]                         | False    |         |
| exports   | ExportableCnf[]                         | False    |         |
| context   | CellContext                             | False    |         |
| listen    | string, { [key: string]: ServiceHandler } | true     |         |

**`ServiceConfig`:**
| Name  | Type                         | Required | Default | Description                                                                                                                                                                                           |
|:------|:-----------------------------|:---------|:--------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| scope | 'public', 'space', 'private' | False    | 'space' | Service handler accessibility:<br/>- 'space': limit access to the cell with the same space only.<br/>- 'public': accessible from anywhere.<br/>- 'private': limit access to the cell only. |
| pipes | Pipe[]                       | False    |         |                                                                                                                                                                                                       |

**`ModuleOpts`:**
| Name      | Type              | Required |
|:----------|:------------------|:---------|
| providers | GenericProvider[] | False    |
| imports   | ImportableCnf[]   | False    |
| exports   | ExportableCnf[]   | False    |

**`ExtModuleOpts extends ModuleOpts`:**
| Name      | Type      | Required | Description                          |
|:----------|:----------|:---------|:-------------------------------------|
| extModule | ClassType | True     | Module class that you want to extend |

**`NetworkConfig = CellConfig[];`**

**`ClassType<T> = { new(...args: any[]): T };`**

**`FuncType<T> = (...args: any[]) => T;`**

**`ValueType<T> = T;`**

**`Token = any;`**

**`ImportableCnf = ClassType<any> | ExtModuleOpts;`**

## 5. Contributor
If you want to make it better, let start with [contributor guideline]().

## 6. License
MIT license.

```ts
@Service({
  scope: 'public',
  pipes: [],
  transaction: 'associate',
})
export class CreateProfile {
  constructor() { }

  async handle() { }
}

@Service({
  scope: 'private',
  pipes: [],
})
export class SignIn {
  constructor() { }

  async handle() { }
}

@Cell({
  imports: [
    JwtModule,
    OauthModule,
  ],
  pipeline: [],
  listen: './events',
})
export class AuthCell { }

ControlPlane.registerNetwork([
  { name: 'AuthCell', space: 'neverland', driver: '@cell/auth#AuthCell' },
]);

const irq = new IRQ({ to: 'AuthCell:SignIn' })
Transportor.send(irq).then((irs: IRS) => {
  console.log(irs);
});
```