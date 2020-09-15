import {shuffle} from 'lodash';
import {defaultConfig} from './configs';
import {
  arraynize,
  dearranize,
  isNodeArray,
  isStringArray,
  sort,
} from './format';
import {Node} from './sorters';

describe('index', () => {
  describe('arraynize()', () => {
    it('simple', () => {
      expect(
        arraynize({
          name: 'optipack',
          version: '0.0.1',
          description: 'Optimizer for package.json',
          license: 'MIT',
        }),
      ).toStrictEqual([
        ['name', 'optipack'],
        ['version', '0.0.1'],
        ['description', 'Optimizer for package.json'],
        ['license', 'MIT'],
      ]);
    });
    it('nested', () => {
      expect(
        arraynize({
          name: 'optipack',
          version: '0.0.1',
          description: 'Optimizer for package.json',
          license: 'MIT',
          dependencies: {
            cac: '^6.6.1',
            lodash: '^4.17.20',
          },
          devDependencies: {
            eslint: '^7.8.1',
            jest: '^26.4.0',
            prettier: '^2.1.1',
          },
        }),
      ).toStrictEqual([
        ['name', 'optipack'],
        ['version', '0.0.1'],
        ['description', 'Optimizer for package.json'],
        ['license', 'MIT'],
        [
          'dependencies',
          [
            ['cac', '^6.6.1'],
            ['lodash', '^4.17.20'],
          ],
        ],
        [
          'devDependencies',
          [
            ['eslint', '^7.8.1'],
            ['jest', '^26.4.0'],
            ['prettier', '^2.1.1'],
          ],
        ],
      ]);
    });
    it('not string/nodes values', () => {
      expect(
        arraynize({
          keywords: ['a', 'b', 'c'],
          true: true,
          false: false,
          zero: 0,
          one: 1,
        }),
      ).toStrictEqual([
        ['keywords', ['a', 'b', 'c']],
        ['true', true],
        ['false', false],
        ['zero', 0],
        ['one', 1],
      ]);
    });
  });
  describe('dearraynize()', () => {
    it('simple', () => {
      expect(
        dearranize([
          ['name', 'optipack'],
          ['version', '0.0.1'],
          ['description', 'Optimizer for package.json'],
          ['license', 'MIT'],
        ]),
      ).toBe(
        `{"name":"optipack","version":"0.0.1","description":"Optimizer for package.json","license":"MIT"}`,
      );
    });
    it('nested', () => {
      expect(
        dearranize([
          ['name', 'optipack'],
          [
            'dependencies',
            [
              ['cac', '^6.6.1'],
              ['lodash', '^4.17.20'],
            ],
          ],
        ]),
      ).toBe(
        `{"name":"optipack","dependencies":{"cac":"^6.6.1","lodash":"^4.17.20"}}`,
      );
    });
    it('not string/nodes values', () => {
      expect(
        dearranize([
          ['keywords', ['a', 'b', 'c']],
          ['true', true],
          ['false', false],
          ['zero', 0],
          ['one', 1],
        ]),
      ).toBe(
        `{"keywords":["a","b","c"],"true":true,"false":false,"zero":0,"one":1}`,
      );
    });
  });
  it('isNodeArray()', () => {
    expect(isNodeArray('MIT')).toBe(false);
    expect(isNodeArray(['a', 'b', 'c'])).toBe(false);
    expect(
      isNodeArray([
        ['prebuild:a', 'a'],
        ['prebuild:b', 'b'],
      ]),
    ).toBe(true);
  });
  it('isStringArray()', () => {
    expect(isStringArray('MIT')).toBe(false);
    expect(isStringArray(['a', 'b', 'c'])).toBe(true);
    expect(
      isStringArray([
        ['prebuild:a', 'a'],
        ['prebuild:b', 'b'],
      ]),
    ).toBe(false);
  });
  describe('sort()', () => {
    it('all with default', () => {
      const expected: Node[] = [
        ['name', 'optipack'],
        ['version', '0.0.1'],
        ['private', expect.any(Boolean)],
        ['description', 'Optimizer for package.json'],
        ['license', 'MIT'],
        ['keywords', ['a', 'b', 'c', 'd']],
        [
          'scripts',
          [
            ['prebuild', expect.any(String)],
            ['prebuild:a', expect.any(String)],
            ['build', expect.any(String)],
            ['build:a', expect.any(String)],
            ['build:b', expect.any(String)],
            ['postbuild', expect.any(String)],
            ['postbuild:a', expect.any(String)],
            ['clean', expect.any(String)],
            ['fmt', expect.any(String)],
            ['lint', expect.any(String)],
          ],
        ],
        [
          'dependencies',
          [
            ['cac', '^6.6.1'],
            ['lodash', '^4.17.20'],
          ],
        ],
        [
          'devDependencies',
          [
            ['@commitlint/cli', expect.any(String)],
            ['@commitlint/config-conventional', expect.any(String)],
            ['@shopify/eslint-plugin', expect.any(String)],
            ['@shopify/prettier-config', expect.any(String)],
            ['@shopify/typescript-configs', expect.any(String)],
            ['@types/jest', expect.any(String)],
            ['@types/lodash', expect.any(String)],
            ['@types/node', expect.any(String)],
            ['eslint', expect.any(String)],
            ['jest', expect.any(String)],
            ['prettier', expect.any(String)],
          ],
        ],
      ];
      expect(
        sort(
          shuffle(
            expected.map(([key, value]) => {
              if (isStringArray(value)) return [key, shuffle(value)];
              if (isNodeArray(value)) return [key, shuffle(value)];
              return [key, value];
            }),
          ),
          defaultConfig,
        ),
      ).toStrictEqual(expected);
    });
  });
});
