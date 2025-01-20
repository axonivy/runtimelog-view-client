import type { LogRequestTypes, LogClient } from '@axonivy/log-view-protocol';
import { BaseRpcClient, urlBuilder, createMessageConnection, Emitter, type Connection, type MessageConnection } from '@axonivy/jsonrpc';
import type { RuntimeLogEntryLsp } from '@axonivy/log-view-protocol';

export class LogClientJsonRpc extends BaseRpcClient implements LogClient {
  protected onDataChangedEmitter = new Emitter<void>();
  onDataChanged = this.onDataChangedEmitter.event;
  protected override setupConnection(): void {
    super.setupConnection();
    this.toDispose.push(this.onDataChangedEmitter);
  }
 
  data(entries: RuntimeLogEntryLsp): Promise<RuntimeLogEntryLsp> {
    return this.sendRequest('data', {
      ...entries,
      entries: []
    });
  }

  sendRequest<K extends keyof LogRequestTypes>(command: K, args?: LogRequestTypes[K][0]): Promise<LogRequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args);
  }

  public static webSocketUrl(url: string) {
    return urlBuilder(url, 'ivy-log-lsp');
  }

  public static async startClient(connection: Connection): Promise<LogClientJsonRpc> {
    return this.startMessageClient(createMessageConnection(connection.reader, connection.writer));
  }

  public static async startMessageClient(connection: MessageConnection): Promise<LogClientJsonRpc> {
    const client = new LogClientJsonRpc(connection);
    await client.start();
    return client;
  }
}
