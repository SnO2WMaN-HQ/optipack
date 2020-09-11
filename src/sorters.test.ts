import {shuffle} from 'lodash';

import {defaultConfig} from './configs';
import {generateRootSorter, Node, scriptsSorter, sortNodes} from './sorters';

describe('index', () => {
  describe('sortNodes()', () => {
    it('alphabeticalSorter()', () => {
      const expected: Node[] = [
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
      ];
      expect(sortNodes(shuffle(expected))).toStrictEqual(expected);
    });
    it('scriptsSorter()', () => {
      const expected: Node[] = [
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
      ];
      expect(sortNodes(shuffle(expected), scriptsSorter)).toStrictEqual(
        expected,
      );
    });
    describe('generateRootSorter()', () => {
      it('default config', () => {
        const expected: Node[] = [
          ['name', expect.anything()],
          ['version', expect.anything()],
          ['description', expect.anything()],
          ['license', expect.anything()],
          ['engines', expect.anything()],
          ['dependencies', expect.anything()],
          ['devDependencies', expect.anything()],
        ];
        expect(
          sortNodes(shuffle(expected), generateRootSorter(defaultConfig)),
        ).toStrictEqual(expected);
      });
    });
  });
});
