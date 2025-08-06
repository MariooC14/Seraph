import { IPCResponse } from '../helpers';
import { NetworkService, PingParams } from '../service/network-service';
import { IpcController } from './ipc-controller';

export class NetworkController extends IpcController {
  constructor(private readonly networkService: NetworkService) {
    super('network');
    this.addHandler('ping', (data: PingParams) => this.handlePing(data));
  }

  @IPCResponse<boolean>()
  handlePing(pingArgs: PingParams) {
    return this.networkService.ping(pingArgs);
  }
}
