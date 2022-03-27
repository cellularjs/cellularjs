---
sidebar_position: 3
---

# API

## 1. createCluster
You can invoke this function from **main thread** to create a cluster of net-workers.  
_(You also need to use [initNetWorker](/docs/foundation/worker/x.%20API#2-initnetworker) from child thread to complete creating cluster)._

```ts
function createCluster(options: ClusterOptions): Promise<void>;
```

**`ClusterOptions`** includes:

| Name      | Type   | Required | Default          | Description                                        |
|-----------|--------|----------|------------------|----------------------------------------------------|
| script    | string | True     |                  | Path to worker script.                             |
| name      | string | False    | 'cll:df_cluster' | Unique cluster name.                               |
| minThread | number | False    | 1                | The minimum number of threads will be initialized. |

## 2. initNetWorker
```ts
function initNetWorker(netCnf: NetworkConfig): Promise<void>;
```
_(For detail about `NetworkConfig`, please follow this [link](/docs/foundation/net/api#51-networkconfig))._

## 3. transfer
This function help transferring [IRQ](/docs/foundation/net/internal-message#2-internal-request) from main thread to child thread and get back [IRS](/docs/foundation/net/internal-message#3-internal-response) later.

```ts
function transfer(irq: IRQ, options?: TransferOptions): Promise<IRS>;
```

**`TransferOptions`** includes:

| Name    | Type   | Required | Default          | Description                                     |
|---------|--------|----------|------------------|-------------------------------------------------|
| cluster | string | False    | 'cll:df_cluster' | The name of cluster you want to transfer IRQ to |

```ts
import { IRQ } from '@cellularjs/net';
import { transfer } from '@cellularjs/worker';

(async () => {
  const irq = new IRQ({ to: 'ABC:CpuIntensiveTask' });
  const irs = await transfer(irq);
})();
```