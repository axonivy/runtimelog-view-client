import type { RuntimeLogViewData } from './data/log';

export interface Event<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export interface Disposable {
  dispose(): void;
}

export interface LogClient {
  data(): Promise<RuntimeLogViewData>;
  clear(): void;
}
