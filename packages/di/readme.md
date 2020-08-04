# <div align="center">CellularJS/DI</div><div align="center"><sub>Modular dependency injection</sub></div><sub>🐘</sub>

## 1. About
DI is one of components of CellularJS but you can use it as standalone package for modular dependency injection. DI got idea from angular interface so you may be familiar with it more easily.

## 2. Get started
```
npm install @cellularjs/di
```

You need to enable typescript decorator to use this package. Add `experimentalDecorators`, `emitDecoratorMetadata` to your existed tsconfig.json.
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
### 3.1. Basic dependency injection
- `useValue` provider
```js
import { Container } from '@cellularjs/di';

const container = new Container();

container.addProvider({
  token: 'key',
  useValue: 'foo',
});

container.resolve('key'); // 'foo'
```

- `useFunc` provider
```js
container.addProvider({
  token: 'key',
  useFunc: (text) => text,
  deps: ['bar'],
});

container.resolve('key'); // 'bar'
```

- `useClass` provider
```js
class Foo { }

container.addProvider({
  token: 'key',
  useClass: Foo,
});

container.resolve('key'); // Foo object
```

- Using a class as `useClass` provider
```ts
class Bar { }

container.addProvider(Bar);

container.resolve(Bar); // Bar object
```

- `useModule` provider: use service from other module without importing that module into current container
```js
class FooService { }

@Module({
  providers: [FooService],
})
class FooModule { }

container.addProvider({
  token: FooService,
  useModule: FooModule,
});

container.resolve<FooService>(FooService); // FooService object
```

- Inject dependencies via constructor
```ts
class Bar { }

@Injectable()
class FooBar {
  constructor(
    @Inject('foo') private foo: string,
    private bar: Bar,
  ) { }

  run() {
    return this.foo + this.bar;
  }
}

const container = new Container();
container.addProviders([
  { token: 'foo', useValue: 'foo' },
  { token: Bar, useValue: 'bar' },
  { token: FooBar, useClass: FooBar },
]);

const fooBar = container.resolve<FooBar>(FooBar);
fooBar.run(); // foobar
```

### 3.2. Modular dependency injection
- Add module
```ts
class FooService { }

@Module({
  providers: [FooService],
})
class FooModule { }

container.addModule(FooModule);

container.resolve<FooService>(FooService); // FooService object
```

- Import/export module
```ts
// foo
class Foo {
  run = () => 'foo';
}

@Module({
  exports: [Foo],
})
class FooModule { }

// bar
class Bar {
  run = () => 'bar';
}

@Module({
  exports: [Bar],
})
class BarModule { }

// foobar
@Injectable()
class FooBar {
  constructor(
    private foo: Foo,
    private bar: Bar,
  ) {}

  run = () => this.foo + this.bar;
}

@Module({
  imports: [FooModule,BarModule],
  exports: [FooBar],
})
class FooBarModule { }

container.addModule(FooBarModule);

const fooBar = container.resolve<FooBar>(FooBar);
fooBar.run(); // 'foobar'
```

- Extend module
```ts
@Injectable()
class FooService {
  constructor(
    @Inject('fooValue') private fooValue: string,
  ) { }

  run() {
    return this.fooValue;
  }
}

@Module({
  exports: [FooService],
})
class FooModule { }

container.addModule({
  extModule: FooModule,
  providers: [
    { token: 'fooValue', useValue: 'foo' }
  ],
});

const fooService = container.resolve<FooService>(FooService);
fooService.run() // 'foo'
```

## 4. API
### 4.1. Annotation/Decorator
```ts
/**
 * Make class's dependencies become injectable.  
 * *Technically, typescript require using a decorator to emit type.*
 */
@Injectable()
```

```ts
/**
 * Allow to inject dependency with specific token.  
 * *For now, it only support inject dependency via constructor.*
 */
@Inject(token: Token)
```

```ts
/**
 * Config module meta data.
 */
@Module(opts: ModuleOpts)
```

### 4.2. Container methods
```ts
/**
 * Convenient method for adding multiple providers into this container.
 */
addProviders(providers: GenericProvider[]): void;
```

```ts
/**
 * Add a provider into this container for resolving dependency later.
 */
addProvider(provider: GenericProvider): void;
```

```ts
/**
 * Convenient method for adding multiple modules into this container.
 */
addModules(modules: (ImportableCnf | ExportableCnf)[]): void;
```

```ts
/**
 * Add a module into this container.
 */
addModule(module: ImportableCnf | ExportableCnf): void;
```

```ts
/**
 * Check if a provider with given token exists in this container.
 */
has(token: Token): boolean;
```

```ts
/**
 * Resolve value by token.
 */
resolve<T>(token: Token): T;
```

```ts
/**
 * Resolve value by token and temporary providers.
 */
resolveWithProviders<T>(token: Token, providers: GenericProvider[]): T;
```

### 4.3. Types
**`GenericProvider<T> = UseModuleProvider | UseClassProvider<T> | ClassType<T> | UseFuncProvider<T> | UseValueProvider<T>`:**
| Name      | Type      | Required  | Default     | Cacheable | Description                                                                                                                                                                                                                         |
|:----------|:----------|:----------|:------------|:----------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| token     | Token     | True      |             |           | Unique identifier for a provider inside container.                                                                                                                                                                                  |
| useValue  | ValueType | Depending |             | Yesn't    | Use a value as dependency value. Actually, you will get same value every time `resolve()` is invoked.                                                                                                                               |
| useFunc   | FuncType  | Depending |             | Yes       | Use a function as factory to assemble dependency value.                                                                                                                                                                             |
| useClass  | ClassType | Depending |             | Yes       | Use a class to resolve dependency value.                                                                                                                                                                                            |
| useModule | ClassType | Depending |             | Depending | Use a module as reference to resolve dependency value without import that module into current container.                                                                                                                            |
| cycle     | CycleType | False     | 'transient' |           | Resolved value life cycle. It is only used for `useClass`, `useFunc` provider.<br/>- 'permanent': resolved value will be cached.<br/>- 'transient': resolved value will not be cached.                                              |
| deps      | any[]     | False     |             |           | Dependencies for useFunc provider.<br/> ***Notice**:<br/> - Dependencies's order must be same as useFunc parameter order.<br/> - Class will be used as a token for `UseClassProvider` provider, so you need to define its provider. |

**`UseValueProvider<T>`:**
| Name     | Type  | Required |
|:---------|:------|:---------|
| token    | Token | True     |
| useValue | any   | True     |

**`UseFuncProvider<T>:`**
| Name    | Type      | Required |
|:--------|:----------|:---------|
| token   | Token     | True     |
| useFunc | FuncType  | True     |
| cycle   | CycleType | False    |

**`UseClassProvider<T>`:**
| Name     | Type      | Required |
|:---------|:----------|:---------|
| token    | Token     | True     |
| useClass | ClassType | True     |
| cycle    | CycleType | False    |

**`UseModuleProvider`:**
| Name      | Type      | Required |
|:----------|:----------|:---------|
| token     | Token     | True     |
| useModule | ClassType | True     |

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

**`ClassType<T> = { new(...args: any[]): T };`**

**`FuncType<T> = (...args: any[]) => T;`**

**`ValueType<T> = T;`**

**`Token = any;`**

**`ImportableCnf = ClassType<any> | ExtModuleOpts;`**

**`ExportableCnf = ClassType<any> | ExtModuleOpts;`**

**`CycleType = 'permanent' | 'transient';`**

## 5. Contributor
If you want to make it better, let start with [contributor guideline](#).

## 6. License
MIT license.
