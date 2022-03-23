import { IRQ } from '@cellularjs/net';
import { MessageType, WorkerMessage, Thread } from '../internal';
import { Transporter } from './transporter';

export async function taskHandler(msg: WorkerMessage<IRQ>) {
  try {
    const irs = await Transporter.send(msg.payload);

    Thread.parentPort.postMessage(<WorkerMessage>{
      type: MessageType.DONE,
      payload: irs,
    });
  } catch (err) {
    Thread.parentPort.postMessage(<WorkerMessage>{
      type: MessageType.ERROR,
      payload: err,
    });
  }
}
