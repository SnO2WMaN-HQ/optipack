import {Config, get} from '@optipack/config';
import {cosmiconfig, cosmiconfigSync} from 'cosmiconfig';

export function getConfigSync(pwd: string): Config {
  const explorer = cosmiconfigSync('optipack');
  const result = explorer.search(pwd);
  return get(result?.config || {});
}

export async function getConfig(pwd: string): Promise<Config> {
  const explorer = cosmiconfig('optipack');
  const result = await explorer.search(pwd);
  return get(result?.config || {});
}
