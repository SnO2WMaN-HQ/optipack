import {JSONObjectNode} from '@optipack/alphabetical-sorter';
import {shuffle} from 'lodash';
import sort, {combine, intereptKeyDependencies, separate} from '.';

describe('scripts-sorter', () => {
  it('no config', () => {
    const expected: JSONObjectNode[] = [
      ['prebuild', expect.anything()],
      ['build', expect.anything()],
      ['postbuild', expect.anything()],
      ['fmt', expect.anything()],
      ['fmt:eslint', expect.anything()],
      ['fmt:prettier', expect.anything()],
      ['lint', expect.anything()],
      ['lint:eslint', expect.anything()],
      ['lint:prettier', expect.anything()],
      ['preversion', expect.anything()],
      ['pretest', expect.anything()],
      ['test', expect.anything()],
      ['test:ci', expect.anything()],
      ['test:watch', expect.anything()],
    ];
    const sorted = sort(shuffle(expected), {});
    expect(sorted).toStrictEqual(expected);
  });

  it('specify order', () => {
    const expected: JSONObjectNode[] = [
      ['prebuild', expect.anything()],
      ['build', expect.anything()],
      ['postbuild', expect.anything()],
      ['pretest', expect.anything()],
      ['test', expect.anything()],
      ['test:ci', expect.anything()],
      ['test:watch', expect.anything()],
      ['lint', expect.anything()],
      ['lint:eslint', expect.anything()],
      ['lint:prettier', expect.anything()],
      ['fmt', expect.anything()],
      ['fmt:eslint', expect.anything()],
      ['fmt:prettier', expect.anything()],
      ['preversion', expect.anything()],
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
    const nodes: JSONObjectNode[] = [
      ['build', expect.anything()],
      ['lint', expect.anything()],
      ['fmt', expect.anything()],
      ['test', expect.anything()],
    ];
    expect(sortSeparated(separate(nodes))).toStrictEqual({
      build: {
        nodes: [['build', expect.anything()].sort()],
      },
      lint: {
        nodes: [['lint', expect.anything()]].sort(),
      },
      fmt: {
        nodes: [['fmt', expect.anything()]].sort(),
      },
      test: {
        nodes: [['test', expect.anything()]].sort(),
      },
    });
  });

  it('separate with coron', () => {
    const nodes: JSONObjectNode[] = [
      ['build', expect.anything()],
      ['lint', expect.anything()],
      ['lint:eslint', expect.anything()],
      ['lint:prettier', expect.anything()],
      ['fmt', expect.anything()],
      ['fmt:eslint', expect.anything()],
      ['fmt:prettier', expect.anything()],
      ['test', expect.anything()],
      ['test:ci', expect.anything()],
      ['test:watch', expect.anything()],
    ];
    expect(sortSeparated(separate(nodes))).toStrictEqual({
      build: {
        nodes: [['build', expect.anything()].sort()],
      },
      lint: {
        nodes: [
          ['lint', expect.anything()],
          ['lint:eslint', expect.anything()],
          ['lint:prettier', expect.anything()],
        ].sort(),
      },
      fmt: {
        nodes: [
          ['fmt', expect.anything()],
          ['fmt:eslint', expect.anything()],
          ['fmt:prettier', expect.anything()],
        ].sort(),
      },
      test: {
        nodes: [
          ['test', expect.anything()],
          ['test:ci', expect.anything()],
          ['test:watch', expect.anything()],
        ].sort(),
      },
    });
  });

  it('separate with pre and post', () => {
    const nodes: JSONObjectNode[] = [
      ['prebuild', expect.anything()],
      ['prebuild:a', expect.anything()],
      ['prebuild:b', expect.anything()],
      ['build', expect.anything()],
      ['build:a', expect.anything()],
      ['build:b', expect.anything()],
      ['postbuild', expect.anything()],
      ['postbuild:a', expect.anything()],
      ['postbuild:b', expect.anything()],
    ];
    expect(sortSeparated(separate(nodes))).toStrictEqual({
      build: {
        nodes: [
          ['build', expect.anything()],
          ['build:a', expect.anything()],
          ['build:b', expect.anything()],
        ].sort(),
      },
      prebuild: {
        nodes: [
          ['prebuild', expect.anything()],
          ['prebuild:a', expect.anything()],
          ['prebuild:b', expect.anything()],
        ].sort(),
      },
      postbuild: {
        nodes: [
          ['postbuild', expect.anything()],
          ['postbuild:a', expect.anything()],
          ['postbuild:b', expect.anything()],
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
          nodes: [
            ['build', expect.anything()],
            ['build:a', expect.anything()],
            ['build:b', expect.anything()],
          ],
        },
        lint: {
          nodes: [
            ['lint', expect.anything()],
            ['lint:eslint', expect.anything()],
            ['lint:prettier', expect.anything()],
          ],
        },
        fmt: {
          nodes: [
            ['fmt', expect.anything()],
            ['fmt:eslint', expect.anything()],
            ['fmt:prettier', expect.anything()],
          ],
        },
        test: {
          nodes: [
            ['test', expect.anything()],
            ['test:ci', expect.anything()],
            ['test:watch', expect.anything()],
          ],
        },
      }),
    ).toStrictEqual({
      build: {
        base: [
          ['build', expect.anything()],
          ['build:a', expect.anything()],
          ['build:b', expect.anything()],
        ],
        pre: [],
        post: [],
      },
      lint: {
        base: [
          ['lint', expect.anything()],
          ['lint:eslint', expect.anything()],
          ['lint:prettier', expect.anything()],
        ],
        pre: [],
        post: [],
      },
      fmt: {
        base: [
          ['fmt', expect.anything()],
          ['fmt:eslint', expect.anything()],
          ['fmt:prettier', expect.anything()],
        ],
        pre: [],
        post: [],
      },
      test: {
        base: [
          ['test', expect.anything()],
          ['test:ci', expect.anything()],
          ['test:watch', expect.anything()],
        ],
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
            ['build', expect.anything()],
            ['build:a', expect.anything()],
            ['build:b', expect.anything()],
          ],
        },
        prebuild: {
          nodes: [
            ['prebuild', expect.anything()],
            ['prebuild:a', expect.anything()],
            ['prebuild:b', expect.anything()],
          ],
        },
        postbuild: {
          nodes: [
            ['postbuild', expect.anything()],
            ['postbuild:a', expect.anything()],
            ['postbuild:b', expect.anything()],
          ],
        },
      }),
    ).toStrictEqual({
      build: {
        base: [
          ['build', expect.anything()],
          ['build:a', expect.anything()],
          ['build:b', expect.anything()],
        ],
        pre: [
          ['prebuild', expect.anything()],
          ['prebuild:a', expect.anything()],
          ['prebuild:b', expect.anything()],
        ],
        post: [
          ['postbuild', expect.anything()],
          ['postbuild:a', expect.anything()],
          ['postbuild:b', expect.anything()],
        ],
      },
    });
  });

  it('complex', () => {
    expect(
      combine({
        build: {
          nodes: [['build', expect.anything()]],
        },
        prebuild: {
          nodes: [['prebuild', expect.anything()]],
        },
        postbuild: {
          nodes: [['postbuild', expect.anything()]],
        },
        preversion: {
          nodes: [['preversion', expect.anything()]],
        },
      }),
    ).toStrictEqual({
      build: {
        base: [['build', expect.anything()]],
        pre: [['prebuild', expect.anything()]],
        post: [['postbuild', expect.anything()]],
      },
      preversion: {
        base: [['preversion', expect.anything()]],
        pre: [],
        post: [],
      },
    });
  });
});
