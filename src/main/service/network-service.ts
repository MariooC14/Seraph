import net from 'node:net';
import { IPCError } from '../helpers';

export type PingParams = {
  address: string;
  port?: number;
};

export class NetworkService {
  ping({ address, port = 22 }: PingParams) {
    return new Promise((resolve, reject) => {
      net
        .createConnection({ host: address, port, timeout: 2500 })
        .on('connect', () => {
          resolve(true);
        })
        .on('error', err => {
          if (err instanceof AggregateError) {
            reject(
              new IPCError('PingError', 'Multiple errors occurred while pinging', {
                messages: err.errors.map(e => e.message)
              })
            );
          } else {
            reject(
              new IPCError('PingError', `Failed to ping ${address}:${port}`, {
                messages: [err.message]
              })
            );
          }
        })
        .on('timeout', () => {
          reject(
            new IPCError('PingTimeout', `Ping to ${address}:${port} timed out`, {
              messages: [`Ping to ${address}:${port} timed out after 2500ms`]
            })
          );
        });
    });
  }
}
