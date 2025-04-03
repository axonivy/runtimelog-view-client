import type { LogClient, RuntimeLogEntry } from '@axonivy/log-view-protocol';
import { Emitter } from '@axonivy/jsonrpc';
import { data } from './data-mock';

export class LogClientMock implements LogClient {
  private logData: RuntimeLogEntry[] = data;

  protected onValidationChangedEmitter = new Emitter<void>();
  onValidationChanged = this.onValidationChangedEmitter.event;
  protected onDataChangedEmitter = new Emitter<void>();
  onDataChanged = this.onDataChangedEmitter.event;

  data(): Promise<RuntimeLogEntry[]> {
    return Promise.resolve(this.logData);
  }

  clear(): void {
    this.logData = [];
  }
}
