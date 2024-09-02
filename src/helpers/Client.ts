import { $fetch } from 'ofetch';

export class Client {
  private node: string;
  private nodes: string[];

  constructor(nodes: string[]) {
    this.nodes = nodes;
    this.node = nodes[0];
  }

  async call<T>(method: string, params: object | object[] = []) {
    const postData = {
      id: 0,
      jsonrpc: '2.0',
      method,
      params,
    };

    const body = JSON.stringify(postData, (_, value: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (value && typeof value === 'object' && value.type === 'Buffer') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        return Buffer.from(value.data).toString('hex');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value;
    });

    let result = null;

    const request = await $fetch<{ result: T }>(this.node, {
      body,
      method: 'POST',
    });

    result = request.result;

    return result;
  }

  failover(reason = '') {
    let index = this.nodes.indexOf(this.node) + 1;

    if (index === this.nodes.length) index = 0;

    this.node = this.nodes[index];

    console.log(`Failed over to: ${this.node}. Reason: ${reason}`);
  }
}
