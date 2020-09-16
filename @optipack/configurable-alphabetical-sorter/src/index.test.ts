import {shuffle} from 'lodash';
import sort from '.';

describe('configurable-alphabetical-sorter', () => {
  it('no config', () => {
    const expected: [string, any][] = [
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
    const expected: [string, any][] = [
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

  it('for script', () => {
    const expected: [string, any][] = [
      ['build', expect.anything()],
      ['test', expect.anything()],
      ['lint', expect.anything()],
      ['fmt', expect.anything()],
    ];
    expect(
      sort(shuffle(expected), {
        order: ['build', 'test', 'lint', 'fmt'],
      }),
    ).toStrictEqual(expected);
  });
});
