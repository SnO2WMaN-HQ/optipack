import {Config} from '@optipack/config';
import {arraynize, sortRoot, stringify} from './format';

export function format(json: string, config: Config): string {
  return stringify(sortRoot(arraynize(JSON.parse(json)), config));
}
