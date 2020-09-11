import {readFileSync} from 'fs';
import {resolve} from 'path';
import {format} from 'prettier';
import {plugin} from '.';

describe('sort', () => {
  it('sort', () => {
    const expected: string = readFileSync(
      resolve(__dirname, 'fixtures', '1_expected.json'),
      'utf8',
    );
    const code: string = readFileSync(
      resolve(__dirname, 'fixtures', '1.json'),
      'utf8',
    );
    const actual: string = format(code, {
      parser: 'json-stringify',
      filepath: 'package.json',
      plugins: [plugin],
    });

    expect(actual).toBe(expected);
  });
});
