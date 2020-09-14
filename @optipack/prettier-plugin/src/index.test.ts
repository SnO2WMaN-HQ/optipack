import {readFileSync} from 'fs';
import {resolve} from 'path';
import {format, Options} from 'prettier';
import {plugin} from '.';

const prettierFormatOption: Options = {
  parser: 'json-stringify',
  filepath: 'package.json',
  plugins: [plugin],
};

describe('sort', () => {
  it('1', () => {
    const expected: string = readFileSync(
      resolve(__dirname, 'fixtures', '1_expected.json'),
      'utf8',
    );
    const code: string = readFileSync(
      resolve(__dirname, 'fixtures', '1.json'),
      'utf8',
    );
    const actual: string = format(code, prettierFormatOption);

    expect(actual).toBe(expected);
  });
});
