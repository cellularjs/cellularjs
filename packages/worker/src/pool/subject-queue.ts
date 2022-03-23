import { Observer } from './observer';

export class SubjectQueue<Data = any> {
  private _obs: Observer<Data>[] = [];

  notify(data: Data) {
    if (this._obs.length === 0) {
      return;
    }

    const observer = this._obs.shift();
    observer.update(data);
  }

  addObserver(ob: Observer<Data>) {
    this._obs.push(ob);
  }
}
