import {shuffle} from 'lodash';
import {
  extractUniqueKey,
  separateByUniqueKeys,
  separateDetailed,
  sort,
  sortScriptsKeys,
} from './scripts';

describe('scripts', () => {
  describe('sort', () => {
    it('empty', () => {
      expect(sort({})).toStrictEqual([]);
    });
    it('simple', () => {
      expect(
        sort({
          build: 'build',
          clean: 'clean',
        }),
      ).toStrictEqual([
        ['build', expect.any(String)],
        ['clean', expect.any(String)],
      ]);
    });
    it('colon case', () => {
      expect(
        sort({
          clean: 'clean',
          build: 'build',
          'build:a': 'build',
          'build:b': 'build',
          fmt: 'fmt',
          lint: 'lint',
        }),
      ).toStrictEqual([
        ['build', expect.any(String)],
        ['build:a', expect.any(String)],
        ['build:b', expect.any(String)],
        ['clean', expect.any(String)],
        ['fmt', expect.any(String)],
        ['lint', expect.any(String)],
      ]);
    });
    it('pre* and post*', () => {
      expect(
        sort({
          clean: 'clean',
          build: 'build',
          'build:a': 'build',
          'build:b': 'build',
          prebuild: 'prebuild',
          'prebuild:a': 'prebuild:a',
          postbuild: 'postbuild',
          'postbuild:a': 'postbuild:a',
          fmt: 'fmt',
          lint: 'lint',
        }),
      ).toStrictEqual([
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
      ]);
    });
  });

  describe('sortScriptsKeys()', () => {
    it('sort simply', () => {
      const expected = ['build', 'clean', 'dev', 'fmt', 'lint'];
      expect(sortScriptsKeys(shuffle(expected))).toStrictEqual(expected);
    });

    it('sort colon case', () => {
      const expected = [
        'build',
        'build:a',
        'build:b',
        'build:c',
        'dev:a',
        'dev:b',
      ];
      expect(sortScriptsKeys(shuffle(expected))).toStrictEqual(expected);
    });

    it('sort with pre* and post*', () => {
      const expected = ['prebuild', 'build', 'postbuild', 'clean'];
      expect(sortScriptsKeys(shuffle(expected))).toStrictEqual(expected);
    });
  });

  describe('fuck()', () => {
    it('base only', () => {
      expect(separateDetailed(['build', 'build:a', 'build:b'])).toStrictEqual([
        'build',
        {base: ['build', 'build:a', 'build:b'], pre: [], post: []},
      ]);
      expect(separateDetailed(['build:a', 'build:b'])).toStrictEqual([
        'build',
        {base: ['build:a', 'build:b'], pre: [], post: []},
      ]);
    });

    it('with pre* and post*', () => {
      expect(
        separateDetailed([
          'build',
          'build:a',
          'build:b',
          'prebuild',
          'postbuild',
        ]),
      ).toStrictEqual([
        'build',
        {
          base: ['build', 'build:a', 'build:b'],
          pre: ['prebuild'],
          post: ['postbuild'],
        },
      ]);
    });
  });

  describe('extractUniqueKey()', () => {
    it('extract', () => {
      expect(
        extractUniqueKey([
          'build',
          'build:a',
          'prebuild',
          'prebuild:a',
          'postbuild',
          'postbuild:a',
          'dev',
          'predev',
          'postdev',
        ]).sort(),
      ).toStrictEqual(['dev', 'build'].sort());
    });
  });

  describe('separateByUniqueKeys()', () => {
    it('separate', () => {
      expect(
        separateByUniqueKeys([
          'build',
          'build:a',
          'prebuild',
          'prebuild:a',
          'postbuild',
          'postbuild:a',
          'dev',
          'predev',
          'postdev',
        ]).map((array) => array.sort()),
      ).toStrictEqual([
        [
          'build',
          'build:a',
          'prebuild',
          'prebuild:a',
          'postbuild',
          'postbuild:a',
        ].sort(),
        ['dev', 'predev', 'postdev'].sort(),
      ]);
    });
  });
});
