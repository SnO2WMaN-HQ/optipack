import {shuffle} from 'lodash';
import sort, {combine, intereptKeyDependencies, separate} from '.';

describe('scripts-sorter', () => {
  it('no config', () => {
    const expected: [string, string][] = [
      ['prebuild', 'prebuild'],
      ['build', 'build'],
      ['postbuild', 'postbuild'],
      ['fmt', 'fmt'],
      ['fmt:eslint', 'fmt:eslint'],
      ['fmt:prettier', 'fmt:prettier'],
      ['lint', 'lint'],
      ['lint:eslint', 'lint:eslint'],
      ['lint:prettier', 'lint:prettier'],
      ['preversion', 'preversion'],
      ['pretest', 'pretest'],
      ['test', 'test'],
      ['test:ci', 'test:ci'],
      ['test:watch', 'test:watch'],
    ];
    const sorted = sort(shuffle(expected), {});
    expect(sorted).toStrictEqual(expected);
  });

  it('specify order', () => {
    const expected: [string, string][] = [
      ['prebuild', 'prebuild'],
      ['build', 'build'],
      ['postbuild', 'postbuild'],
      ['pretest', 'pretest'],
      ['test', 'test'],
      ['test:ci', 'test:ci'],
      ['test:watch', 'test:watch'],
      ['lint', 'lint'],
      ['lint:eslint', 'lint:eslint'],
      ['lint:prettier', 'lint:prettier'],
      ['fmt', 'fmt'],
      ['fmt:eslint', 'fmt:eslint'],
      ['fmt:prettier', 'fmt:prettier'],
      ['preversion', 'preversion'],
    ];
    const sorted = sort(shuffle(expected), {
      order: ['build', 'test', 'lint', 'fmt'],
    });
    expect(sorted).toStrictEqual(expected);
  });
});

function sortSeparated(
  separated: ReturnType<typeof separate>,
): ReturnType<typeof separate> {
  return Object.fromEntries(
    Object.entries(separated).map(([key, {nodes, ...other}]) => [
      key,
      {
        ...other,
        nodes: nodes.sort(),
      },
    ]),
  );
}

describe('separate()', () => {
  it('simply', () => {
    const nodes: [string, string][] = [
      ['build', 'build'],
      ['lint', 'lint'],
      ['fmt', 'fmt'],
      ['test', 'test'],
    ];
    expect(sortSeparated(separate(nodes))).toStrictEqual({
      build: {
        nodes: [['build', 'build'].sort()],
      },
      lint: {
        nodes: [['lint', 'lint']].sort(),
      },
      fmt: {
        nodes: [['fmt', 'fmt']].sort(),
      },
      test: {
        nodes: [['test', 'test']].sort(),
      },
    });
  });

  it('separate with coron', () => {
    const nodes: [string, string][] = [
      ['build', 'build'],
      ['lint', 'lint'],
      ['lint:eslint', 'lint:eslint'],
      ['lint:prettier', 'lint:prettier'],
      ['fmt', 'fmt'],
      ['fmt:eslint', 'fmt:eslint'],
      ['fmt:prettier', 'fmt:prettier'],
      ['test', 'test'],
      ['test:ci', 'test:ci'],
      ['test:watch', 'test:watch'],
    ];
    expect(sortSeparated(separate(nodes))).toStrictEqual({
      build: {
        nodes: [['build', 'build'].sort()],
      },
      lint: {
        nodes: [
          ['lint', 'lint'],
          ['lint:eslint', 'lint:eslint'],
          ['lint:prettier', 'lint:prettier'],
        ].sort(),
      },
      fmt: {
        nodes: [
          ['fmt', 'fmt'],
          ['fmt:eslint', 'fmt:eslint'],
          ['fmt:prettier', 'fmt:prettier'],
        ].sort(),
      },
      test: {
        nodes: [
          ['test', 'test'],
          ['test:ci', 'test:ci'],
          ['test:watch', 'test:watch'],
        ].sort(),
      },
    });
  });

  it('separate with pre and post', () => {
    const nodes: [string, string][] = [
      ['prebuild', 'prebuild'],
      ['prebuild:a', 'prebuild:a'],
      ['prebuild:b', 'prebuild:b'],
      ['build', 'build'],
      ['build:a', 'build:a'],
      ['build:b', 'build:b'],
      ['postbuild', 'postbuild'],
      ['postbuild:a', 'postbuild:a'],
      ['postbuild:b', 'postbuild:b'],
    ];
    expect(sortSeparated(separate(nodes))).toStrictEqual({
      build: {
        nodes: [
          ['build', 'build'],
          ['build:a', 'build:a'],
          ['build:b', 'build:b'],
        ].sort(),
      },
      prebuild: {
        nodes: [
          ['prebuild', 'prebuild'],
          ['prebuild:a', 'prebuild:a'],
          ['prebuild:b', 'prebuild:b'],
        ].sort(),
      },
      postbuild: {
        nodes: [
          ['postbuild', 'postbuild'],
          ['postbuild:a', 'postbuild:a'],
          ['postbuild:b', 'postbuild:b'],
        ].sort(),
      },
    });
  });
});

describe('intereptKeyDependencies()', () => {
  it('simply', () => {
    expect(intereptKeyDependencies(['build', 'test'])).toStrictEqual({
      build: {},
      test: {},
    });
  });

  it('with pre and post', () => {
    expect(
      intereptKeyDependencies([
        'build',
        'prebuild',
        'postbuild',
        'test',
        'pretest',
        'clean',
        'postclean',
        'preversion',
      ]),
    ).toStrictEqual({
      build: {pre: 'prebuild', post: 'postbuild'},
      test: {pre: 'pretest'},
      clean: {post: 'postclean'},
      preversion: {},
    });
  });
});

describe('combine()', () => {
  it('simply', () => {
    expect(
      combine({
        build: {
          nodes: [['build', 'build']],
        },
        lint: {
          nodes: [['lint', 'lint']],
        },
        fmt: {
          nodes: [['fmt', 'fmt']],
        },
        test: {
          nodes: [['test', 'test']],
        },
      }),
    ).toStrictEqual({
      build: {
        base: [['build', 'build']],
        pre: [],
        post: [],
      },
      lint: {
        base: [['lint', 'lint']],
        pre: [],
        post: [],
      },
      fmt: {
        base: [['fmt', 'fmt']],
        pre: [],
        post: [],
      },
      test: {
        base: [['test', 'test']],
        pre: [],
        post: [],
      },
    });
  });

  it('with pre and post', () => {
    expect(
      combine({
        build: {
          nodes: [
            ['build', 'build'],
            ['build:a', 'build:a'],
            ['build:b', 'build:b'],
          ],
        },
        prebuild: {
          nodes: [['prebuild', 'prebuild']],
        },
        postbuild: {
          nodes: [['postbuild', 'postbuild']],
        },
      }),
    ).toStrictEqual({
      build: {
        base: [
          ['build', 'build'],
          ['build:a', 'build:a'],
          ['build:b', 'build:b'],
        ],
        pre: [['prebuild', 'prebuild']],
        post: [['postbuild', 'postbuild']],
      },
    });
  });

  it('complex', () => {
    expect(
      combine({
        build: {
          nodes: [['build', 'build']],
        },
        prebuild: {
          nodes: [['prebuild', 'prebuild']],
        },
        postbuild: {
          nodes: [['postbuild', 'postbuild']],
        },
        preversion: {
          nodes: [['preversion', 'preversion']],
        },
      }),
    ).toStrictEqual({
      build: {
        base: [['build', 'build']],
        pre: [['prebuild', 'prebuild']],
        post: [['postbuild', 'postbuild']],
      },
      preversion: {
        base: [['preversion', 'preversion']],
        pre: [],
        post: [],
      },
    });
  });
});
