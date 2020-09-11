import {cosmiconfig} from 'cosmiconfig';

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

export async function getConfig(): Promise<Config> {
  const result = await cosmiconfig('optipack').search();
  if (result?.isEmpty) return defaultConfig;
  return Object.assign(defaultConfig, result?.config);
}
