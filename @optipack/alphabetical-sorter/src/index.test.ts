import {shuffle} from 'lodash';
import sort from '.';

describe('alphabetical-sort', () => {
  it('sort', () => {
    const expected: [string, any][] = [
      ['a', expect.anything()],
      ['b', expect.anything()],
      ['c', expect.anything()],
      ['d', expect.anything()],
      ['x', expect.anything()],
      ['y', expect.anything()],
      ['z', expect.anything()],
    ];
    expect(sort(shuffle(expected))).toStrictEqual(expected);
  });
});
