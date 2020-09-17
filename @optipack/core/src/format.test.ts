import {defaultConfig} from '@optipack/config';
import {shuffle} from 'lodash';
import {arraynize, sortRoot, stringify, validScripts} from './format';

function shuffleComplex(array: [string, any][]): [string, any][] {
  return shuffle(
    array.map(([key, value]) => [
      key,
      Array.isArray(value) && value.every(Array.isArray)
        ? shuffle(value)
        : value,
    ]),
  );
}

describe('arraynize()', () => {
  it('nested', () => {
    expect(
      arraynize({
        name: 'optipack',
        version: '0.0.1',
        description: 'Optimizer for package.json',
        license: 'MIT',
        private: true,
        number0: 0,
        number1: 1,
        keywords: ['a', 'b', 'c'],
        scripts: {
          build: 'build',
          test: 'test',
        },
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
      ['private', true],
      ['number0', 0],
      ['number1', 1],
      ['keywords', ['a', 'b', 'c']],
      [
        'scripts',
        [
          ['build', 'build'],
          ['test', 'test'],
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
          ['eslint', '^7.8.1'],
          ['jest', '^26.4.0'],
          ['prettier', '^2.1.1'],
        ],
      ],
    ]);
  });
});

describe('stringify()', () => {
  it('scripts', () => {
    expect(
      stringify([
        [
          'scripts',
          [
            ['build', 'lerna run build'],
            ['clean', 'run-s -cn clean:*'],
          ],
        ],
      ]),
    ).toBe(
      `{"scripts":{"build":"lerna run build","clean":"run-s -cn clean:*"}}`,
    );
  });
  it('keywords', () => {
    expect(
      stringify([['keywords', ['format', 'optipack', 'package.json']]]),
    ).toBe(`{"keywords":["format","optipack","package.json"]}`);
  });
  it('all', () => {
    expect(
      stringify([
        ['name', 'optipack'],
        ['version', '0.0.1'],
        ['private', true],
        ['description', 'Optimizer for package.json'],
        ['license', 'MIT'],
        [
          'author',
          [
            ['email', 'me@sno2wman.dev'],
            ['name', 'SnO2WMaN'],
          ],
        ],
        ['keywords', ['format', 'optipack', 'package.json']],
        ['workspaces', ['@optipack/*']],
        [
          'scripts',
          [
            [
              'build',
              'lerna run build --stream --parallel --include-dependencies',
            ],
            ['clean', 'run-s -cn clean:*'],
            ['clean:packages', 'lerna run clean --stream --parallel'],
            ['clean:root', 'lerna clean --yes'],
            [
              'test',
              'lerna run test --stream --parallel --include-dependencies',
            ],
            [
              'test:ci',
              'lerna run test:ci --stream --parallel --include-dependencies',
            ],
            ['lint', 'run-s -cn lint:*'],
            ['lint:eslint', 'eslint . --ext .js,.ts'],
            ['lint:prettier', 'prettier --check **/*.{json,yml,yaml,md}'],
            ['fmt', 'run-s -cn fmt:*'],
            ['fmt:eslint', 'yarn lint:eslint --fix'],
            ['fmt:prettier', 'yarn lint:prettier --write'],
            ['postinstall', 'lerna bootstrap'],
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
            ['@arkweid/lefthook', '0.7.2'],
            ['@commitlint/cli', '11.0.0'],
            ['@commitlint/config-conventional', '11.0.0'],
            ['@commitlint/config-lerna-scopes', '11.0.0'],
            ['@shopify/eslint-plugin', '38.0.0'],
            ['@shopify/prettier-config', '1.1.1'],
            ['@types/jest', '26.0.13'],
            ['@types/lodash', '4.14.161'],
            ['@types/prettier', '2.1.0'],
            ['conventional-changelog-cli', '2.1.0'],
            ['eslint', '7.8.1'],
            ['jest', '26.4.2'],
            ['lerna', '3.22.1'],
            ['lodash', '4.17.20'],
            ['npm-run-all', '4.1.5'],
            ['prettier', '2.1.1'],
            ['prettier-plugin-optipack', '^1.0.0'],
            ['prettier-plugin-organize-imports', '1.1.1'],
            ['ts-jest', '26.3.0'],
            ['ts-node', '9.0.0'],
            ['tsconfig-paths', '3.9.0'],
            ['typescript', '3.9.7'],
          ],
        ],
      ]),
    ).toBe(
      `{"name":"optipack","version":"0.0.1","private":true,"description":"Optimizer for package.json","license":"MIT","author":{"email":"me@sno2wman.dev","name":"SnO2WMaN"},"keywords":["format","optipack","package.json"],"workspaces":["@optipack/*"],"scripts":{"build":"lerna run build --stream --parallel --include-dependencies","clean":"run-s -cn clean:*","clean:packages":"lerna run clean --stream --parallel","clean:root":"lerna clean --yes","test":"lerna run test --stream --parallel --include-dependencies","test:ci":"lerna run test:ci --stream --parallel --include-dependencies","lint":"run-s -cn lint:*","lint:eslint":"eslint . --ext .js,.ts","lint:prettier":"prettier --check **/*.{json,yml,yaml,md}","fmt":"run-s -cn fmt:*","fmt:eslint":"yarn lint:eslint --fix","fmt:prettier":"yarn lint:prettier --write","postinstall":"lerna bootstrap"},"dependencies":{"cac":"^6.6.1","lodash":"^4.17.20"},"devDependencies":{"@arkweid/lefthook":"0.7.2","@commitlint/cli":"11.0.0","@commitlint/config-conventional":"11.0.0","@commitlint/config-lerna-scopes":"11.0.0","@shopify/eslint-plugin":"38.0.0","@shopify/prettier-config":"1.1.1","@types/jest":"26.0.13","@types/lodash":"4.14.161","@types/prettier":"2.1.0","conventional-changelog-cli":"2.1.0","eslint":"7.8.1","jest":"26.4.2","lerna":"3.22.1","lodash":"4.17.20","npm-run-all":"4.1.5","prettier":"2.1.1","prettier-plugin-optipack":"^1.0.0","prettier-plugin-organize-imports":"1.1.1","ts-jest":"26.3.0","ts-node":"9.0.0","tsconfig-paths":"3.9.0","typescript":"3.9.7"}}`,
    );
  });
});

describe('sortRoot()', () => {
  it('all with default', () => {
    const expected: [string, any][] = [
      ['name', 'optipack'],
      ['version', '0.0.1'],
      ['private', true],
      ['description', 'Optimizer for package.json'],
      ['license', 'MIT'],
      ['keywords', ['a', 'b', 'c', 'd']],
      [
        'scripts',
        [
          [
            'build',
            'lerna run build --stream --parallel --include-dependencies',
          ],
          ['clean', 'run-s -cn clean:*'],
          ['clean:packages', 'lerna run clean --stream --parallel'],
          ['clean:root', 'lerna clean --yes'],
          ['fmt', 'run-s -cn fmt:*'],
          ['fmt:eslint', 'yarn lint:eslint --fix'],
          ['fmt:prettier', 'yarn lint:prettier --write'],
          ['lint', 'run-s -cn lint:*'],
          ['lint:eslint', 'eslint . --ext .js,.ts'],
          ['lint:prettier', 'prettier --check **/*.{json,yml,yaml,md}'],
          ['postinstall', 'lerna bootstrap'],
          ['test', 'lerna run test --stream --parallel --include-dependencies'],
          [
            'test:ci',
            'lerna run test:ci --stream --parallel --include-dependencies',
          ],
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
          ['@arkweid/lefthook', '0.7.2'],
          ['@commitlint/cli', '11.0.0'],
          ['@commitlint/config-conventional', '11.0.0'],
          ['@commitlint/config-lerna-scopes', '11.0.0'],
          ['@shopify/eslint-plugin', '38.0.0'],
          ['@shopify/prettier-config', '1.1.1'],
          ['@types/jest', '26.0.13'],
          ['@types/lodash', '4.14.161'],
          ['@types/prettier', '2.1.0'],
          ['conventional-changelog-cli', '2.1.0'],
          ['eslint', '7.8.1'],
          ['jest', '26.4.2'],
          ['lerna', '3.22.1'],
          ['lodash', '4.17.20'],
          ['npm-run-all', '4.1.5'],
          ['prettier', '2.1.1'],
          ['prettier-plugin-optipack', '^1.0.0'],
          ['prettier-plugin-organize-imports', '1.1.1'],
          ['ts-jest', '26.3.0'],
          ['ts-node', '9.0.0'],
          ['tsconfig-paths', '3.9.0'],
          ['typescript', '3.9.7'],
        ],
      ],
    ];
    expect(sortRoot(shuffleComplex(expected), defaultConfig)).toStrictEqual(
      expected,
    );
  });

  it('scripts order', () => {
    const expected: [string, any][] = [
      [
        'scripts',
        [
          [
            'build',
            'lerna run build --stream --parallel --include-dependencies',
          ],
          ['clean', 'run-s -cn clean:*'],
          ['clean:packages', 'lerna run clean --stream --parallel'],
          ['clean:root', 'lerna clean --yes'],
          ['test', 'lerna run test --stream --parallel --include-dependencies'],
          [
            'test:ci',
            'lerna run test:ci --stream --parallel --include-dependencies',
          ],
          ['lint', 'run-s -cn lint:*'],
          ['lint:eslint', 'eslint . --ext .js,.ts'],
          ['lint:prettier', 'prettier --check **/*.{json,yml,yaml,md}'],
          ['fmt', 'run-s -cn fmt:*'],
          ['fmt:eslint', 'yarn lint:eslint --fix'],
          ['fmt:prettier', 'yarn lint:prettier --write'],
          ['postinstall', 'lerna bootstrap'],
        ],
      ],
    ];
    expect(
      sortRoot(shuffleComplex(expected), {
        ...defaultConfig,
        scripts: {sort: true, order: ['build', 'clean', 'test', 'lint', 'fmt']},
      }),
    ).toStrictEqual(expected);
  });

  it('scripts default(alphabetical)', () => {
    const expected: [string, any][] = [
      [
        'scripts',
        [
          [
            'build',
            'lerna run build --stream --parallel --include-dependencies',
          ],
          ['clean', 'run-s -cn clean:*'],
          ['clean:packages', 'lerna run clean --stream --parallel'],
          ['clean:root', 'lerna clean --yes'],
          ['fmt', 'run-s -cn fmt:*'],
          ['fmt:eslint', 'yarn lint:eslint --fix'],
          ['fmt:prettier', 'yarn lint:prettier --write'],
          ['lint', 'run-s -cn lint:*'],
          ['lint:eslint', 'eslint . --ext .js,.ts'],
          ['lint:prettier', 'prettier --check **/*.{json,yml,yaml,md}'],
          ['postinstall', 'lerna bootstrap'],
          ['test', 'lerna run test --stream --parallel --include-dependencies'],
          [
            'test:ci',
            'lerna run test:ci --stream --parallel --include-dependencies',
          ],
        ],
      ],
    ];
    expect(
      sortRoot(shuffleComplex(expected), {
        ...defaultConfig,
        scripts: {sort: true, order: []},
      }),
    ).toStrictEqual(expected);
  });
});

describe('validScripts()', () => {
  it('valid', () => {
    expect(
      validScripts([
        ['build', 'build'],
        ['test', 'test'],
      ]),
    ).toBe(true);
  });

  it('invalid', () => {
    expect(validScripts([0, 1, 2])).toBe(false);
    expect(validScripts(['optipack', 'sort', 'package.json'])).toBe(false);
  });
});

describe('validDependencies()', () => {
  it('valid', () => {
    expect(
      validScripts([
        ['cac', '^6.6.1'],
        ['lodash', '^4.17.20'],
      ]),
    ).toBe(true);
  });

  it('invalid', () => {
    expect(validScripts([0, 1, 2])).toBe(false);
    expect(validScripts(['optipack', 'sort', 'package.json'])).toBe(false);
  });
});
