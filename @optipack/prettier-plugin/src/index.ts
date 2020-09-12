import {Config, defaultConfig, format} from '@optipack/core';
import {cosmiconfigSync} from 'cosmiconfig';
import {Plugin} from 'prettier';
import {parsers as babelParsers} from 'prettier/parser-babel';

const {'json-stringify': jsonParser} = babelParsers;

export function getConfig(pwd?: string): Config {
  const explorer = cosmiconfigSync('optipack');
  const config = explorer.search(pwd)?.config;
  return config ? {...defaultConfig, ...config} : defaultConfig;
}

export const plugin: Plugin = {
  parsers: {
    'json-stringify': {
      ...jsonParser,
      preprocess(text, options) {
        // eslint-disable-next-line no-param-reassign
        text = jsonParser.preprocess
          ? jsonParser.preprocess(text, options)
          : text;
        return /(^|\\|\/)package.json$/.test(options.filepath)
          ? format(text, getConfig(process.cwd()))
          : text;
      },
    },
  },
};
