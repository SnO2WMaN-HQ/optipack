import {shuffle} from 'lodash';
import sort, {JSONObjectNode} from '.';

describe('alphabetical-sort', () => {
  it('sort', () => {
    const expected: JSONObjectNode[] = [
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
