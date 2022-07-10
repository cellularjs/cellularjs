/**
 * Tracer for debugging.
 *
 * Tracer only store unhappy path. For happy path, it must be removed with `clear` method.
 */
export class Tracer<T = any> {
  private traces: T[] = [];

  getTraces() {
    return this.traces;
  }

  log(trace: T) {
    this.traces.push(trace);
    return this.traces.length - 1;
  }

  clear(removeIdx: number) {
    this.traces = this.traces.filter((_, idx) => idx !== removeIdx);
  }
}
