import 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { IRQ, IRS } from '@cellularjs/net';
import { initNetWorker } from '../../src';
import {
  WorkerErrorCode,
  Thread,
  WorkerMessage,
  MessageType,
} from '../../src/internal';
import { taskHandler } from '../../src/net/task-handler';
import { Transporter } from '../../src/net/transporter';

describe('initNetWorker:', () => {
  afterEach(async () => {
    sinon.restore();
  });

  it('throw error if initNetWorker is invoked from main thread', async () => {
    try {
      await initNetWorker([]);

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.eql(WorkerErrorCode.InitNetWorkerFromMainThread);
    }
  });

  it('can run initNetWorker from child thread without error', async () => {
    const onReceivedMessageStub = sinon.stub();
    sinon.stub(Thread, 'isMainThread').get(() => false);
    sinon.stub(Thread, 'parentPort').get(() => ({
      on: onReceivedMessageStub,
      postMessage: () => {},
    }));

    await initNetWorker([]);

    // Fragile ~ too detail.
    expect(onReceivedMessageStub.getCall(0).args[1]).to.eql(taskHandler);
  });

  it('taskHandler, post error message when error occur', async () => {
    const postMessageStub = sinon.stub();
    sinon.stub(Thread, 'parentPort').get(() => ({
      postMessage: postMessageStub,
    }));

    await taskHandler({
      type: MessageType.TASK,
      payload: new IRQ({ to: 'Any:ThrowError' }),
    });
    const postMsg: WorkerMessage = postMessageStub.getCall(0).args[0];

    expect(postMsg.type).to.eql(MessageType.ERROR);
    expect(postMsg.payload).to.be.instanceOf(IRS);
  });

  it('taskHandler, post done message after handling request', async () => {
    // A1:
    const postMessageStub = sinon.stub();
    sinon.stub(Thread, 'parentPort').get(() => ({
      postMessage: postMessageStub,
    }));

    sinon.stub(Transporter, 'send').get(() => {
      return async () => new IRS();
    });

    // A2:
    await taskHandler({
      type: MessageType.TASK,
      payload: new IRQ({ to: 'Any:ThrowError' }),
    });
    const postMsg: WorkerMessage = postMessageStub.getCall(0).args[0];

    // A3:
    expect(postMsg.type).to.eql(MessageType.DONE);
    expect(postMsg.payload).to.be.instanceOf(IRS);
  });
});
