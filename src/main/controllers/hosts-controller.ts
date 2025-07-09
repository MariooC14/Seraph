import { HostConfig } from '@/dts/host-config';
import { IPCResponse } from '../helpers';
import { HostsService } from '../service/hosts-service';
import { IpcController } from './ipc-controller';

export class HostsController extends IpcController {
  constructor(private hostsService: HostsService) {
    super('hosts');
    this.addHandler('getAll', () => this.getHosts());
    this.addHandler('getById', (hostId: string) => this.getHostById(hostId));
    this.addHandler('add', (hostConfig: Omit<HostConfig, 'id'>) => this.addHost(hostConfig));
    this.addHandler('remove', (hostId: string) => this.removeHost(hostId));
  }

  @IPCResponse<HostConfig[]>()
  getHosts() {
    return this.hostsService.getHosts();
  }

  @IPCResponse<HostConfig>()
  getHostById(hostId: string) {
    const host = this.hostsService.getHostById(hostId);
    if (!host) {
      throw new Error(`Host with id ${hostId} not found`);
    }
    return host;
  }

  @IPCResponse<HostConfig>()
  addHost(hostConfig: Omit<HostConfig, 'id'>) {
    return this.hostsService.addHost(hostConfig);
  }

  @IPCResponse<boolean>()
  removeHost(hostId: string) {
    this.hostsService.removeHost(hostId);
    return true;
  }
}
