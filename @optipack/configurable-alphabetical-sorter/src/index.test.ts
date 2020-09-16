import {JSONObjectNode} from '@optipack/alphabetical-sorter';
import {shuffle} from 'lodash';
import sort from '.';

describe('configurable-alphabetical-sorter', () => {
  it('no config', () => {
    const expected: JSONObjectNode[] = [
      ['a', expect.anything()],
      ['b', expect.anything()],
      ['c', expect.anything()],
      ['d', expect.anything()],
      ['x', expect.anything()],
      ['y', expect.anything()],
      ['z', expect.anything()],
    ];
    expect(sort(shuffle(expected), {})).toStrictEqual(expected);
  });

  it('specify order', () => {
    const expected: JSONObjectNode[] = [
      ['x', expect.anything()],
      ['y', expect.anything()],
      ['z', expect.anything()],
      ['a', expect.anything()],
      ['b', expect.anything()],
      ['c', expect.anything()],
      ['d', expect.anything()],
      ['m', expect.anything()],
      ['n', expect.anything()],
      ['o', expect.anything()],
    ];
    expect(
      sort(shuffle(expected), {
        order: ['x', 'y', 'z'],
      }),
    ).toStrictEqual(expected);
  });
});
