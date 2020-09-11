export const defaultOrder = [
  'name',
  'version',
  'private',
  // package info
  'description',
  'license',
  'author',
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
};

export type Config = typeof defaultConfig;
