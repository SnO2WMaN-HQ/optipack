#!/usr/bin/env node
import {format} from '@optipack/core';
import {getConfig} from '@optipack/cosmiconfig';
import {cac} from 'cac';
import {readFile, writeFile} from 'fs/promises';
import * as path from 'path';
import * as prettier from 'prettier';

export async function getOption(): Promise<{filePath: string; write: boolean}> {
  const cli = cac();
  cli
    .option('-f, --file [path]', 'Location of package.json', {
      default: path.resolve(process.cwd(), 'package.json'),
    })
    .option('-w, --write', 'Overwrite', {
      default: false,
    });
  cli.help();
  const parsed = cli.parse();
  return {
    filePath: parsed.options.file as string,
    write: parsed.options.write as boolean,
  };
}

(async () => {
  const config = await getConfig(process.cwd());
  const {filePath, write} = await getOption();

  await readFile(filePath, {encoding: 'utf-8'})
    .then((content) => format(content, config))
    .then((content) =>
      prettier.format(content, {
        parser: 'json-stringify',
      }),
    )
    .then((content) =>
      write ? writeFile(filePath, content) : console.log(content),
    )
    .catch(console.error);
})();
