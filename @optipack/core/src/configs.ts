export const defaultOrder = [
  'name',
  'version',
  'private',
  // package info
  'description',
  'license',
  'author',
  'homepage',
  'repository',
  'bugs',
  'keywords',
  // publish settings
  'publishConfig',
  'main',
  'source',
  'types',
  'typings',
  'files',
  'bin',
  // not package info
  'workspaces',
  // scripts
  'scripts',
  // dependencies
  'engines',
  'dependencies',
  'devDependencies',
  'peerDependencies',
];

export const defaultConfig = {
  order: defaultOrder,
  scripts: {
    sort: true,
    order: [],
  },
};

export type Config = typeof defaultConfig;
