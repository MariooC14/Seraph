import { NodeSSH } from "node-ssh"; // Delete that shii if we cannot use it.

export async function connectToServer(server: {
  host: string;
  port: number;
  username: string;
  privateKey: string;
}) {
  const client = new NodeSSH();
  await client.connect(server);
  return client;
}
