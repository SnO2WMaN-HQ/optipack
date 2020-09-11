export const defaultOrder = [
  'name',
  'version',
  'private',
  'description',
  'license',
  'author',
  'keywords',
  'repository',
  'bugs',
  'bin',
  'scripts',
  'engines',
  'dependencies',
  'devDependencies',
  'peerDependencies',
];

export const defaultConfig = {
  order: defaultOrder,
};

export type Config = typeof defaultConfig;
