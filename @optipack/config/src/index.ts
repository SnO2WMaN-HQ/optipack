import {merge} from 'lodash';
import {PartialDeep} from 'type-fest';

export const defaultConfig: Config = {
  order: [
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
    'directories',
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
  ],
  scripts: {
    sort: true,
    order: [],
  },
};

export interface Config {
  order: string[];
  scripts: {sort: boolean; order: string[]};
}

export function get(config: PartialDeep<Config>): Config {
  return merge(defaultConfig, config);
}
