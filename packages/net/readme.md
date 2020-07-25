# <div align="center">CellularJS/Net</div><div align="center"></div><sub>🐘</sub>

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
### 3. Examples

### 4. API
### 4.1. Annotation/Decorator
```ts
/**
 * 
 */
@Cell(cellConfig: CellConfig)
```

```ts
/**
 * 
 */
@Event()
```

### 4.2. Control plane methods
```ts
/**
 * 
 */
static getResolvedCell(cellName: string): ResolvedCell | undefined;
```

```ts
/**
 * 
 */
static async registerNetwork(cellName: string): Promise<void>;
```

### 4.3. Types

## 5. Contributor
If you want to make it better, let start with [contributor guideline]().

## 6. License
MIT license.
