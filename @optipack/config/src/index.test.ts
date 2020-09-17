import {defaultConfig, get} from '.';

describe('get()', () => {
  it('give nothing', () => {
    expect(get({})).toStrictEqual(defaultConfig);
  });

  it('give scripts order', () => {
    expect(get({scripts: {order: ['build', 'test']}})).toStrictEqual({
      ...defaultConfig,
      scripts: {
        sort: expect.any(Boolean),
        order: ['build', 'test'],
      },
    });
  });

  it('turn off scripts sort', () => {
    expect(get({scripts: {sort: false}})).toStrictEqual({
      ...defaultConfig,
      scripts: {
        sort: false,
        order: expect.any(Array),
      },
    });
  });
});
