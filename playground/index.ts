import { Client } from '../src';

const hiveClient = new Client(['https://api.hive.blog']);

console.log(await hiveClient.call('condenser_api.get_accounts', [['reazuliqbal']]));
