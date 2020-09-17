import alphabeticalSorter from '@optipack/alphabetical-sorter';
import configurableAlphabeticalSorter from '@optipack/configurable-alphabetical-sorter';
import scriptsSorter from '@optipack/scripts-sorter';
import {ascending} from 'alpha-sort';
import {isArray, isBoolean, isNull, isNumber, isString} from 'lodash';
import {Config} from './configs';

export type JSonScalar = string | number | boolean | null;
export type Node = [string, JSonScalar | (JSonScalar | Node)[]];

export function isRecursiveToStringify(
  value: Parameters<typeof stringify>[0][number][1],
): value is Parameters<typeof stringify>[0] {
  return (
    Array.isArray(value) &&
    value.every(
      (node) =>
        Array.isArray(node) && node.length === 2 && typeof node[0] === 'string',
    )
  );
}

export const stringify = (nodes: ReturnType<typeof sortRoot>): string => {
  const stringifiedArray = nodes.map(([key, value]) => [
    key,
    isRecursiveToStringify(value) ? stringify(value) : JSON.stringify(value),
  ]);
  const stringified = stringifiedArray.reduce(
    (pre, [key, value], i, {length}) => {
      const comma = i === length - 1 ? '' : ',';
      return `${pre}"${key}":${value}${comma}`;
    },
    '',
  );
  return `{${stringified}}`;
};

export function arraynize(org: ReturnType<typeof JSON.parse>): Node[] {
  return Object.entries(org).map(([key, value]) =>
    isString(value) ||
    isNumber(value) ||
    isBoolean(value) ||
    isNull(value) ||
    isArray(value)
      ? [key, value]
      : [key, arraynize(value)],
  );
}

export function sortRoot(
  rootMap: ReturnType<typeof arraynize>,
  config: Config,
): Node[] {
  return configurableAlphabeticalSorter(
    rootMap.map((element) => sortParts(element, config)),
    {order: config.order},
  );
}

export function sortParts([key, value]: Node, config: Config): Node {
  if (key === 'scripts' && validScripts(value)) {
    return [key, scriptsSorter(value, {order: config.scriptsOrder})];
  }

  if (
    (key === 'engines' ||
      key === 'dependencies' ||
      key === 'devDependencies' ||
      key === 'peerDependencies') &&
    validDependencies(value)
  ) {
    return [key, alphabeticalSorter(value)];
  }

  if (isStringArray(value)) return [key, value.sort(ascending)];

  return [key, value];
}

export function validScripts(
  value: Parameters<typeof sortParts>[0][1],
): value is [string, string][] {
  return isArray(value) && value.every((node) => Array.isArray(node));
}
export const validDependencies = validScripts;

export function isStringArray(
  value: Parameters<typeof validScripts>[0],
): value is string[] {
  if (!Array.isArray(value)) return false;
  return true;
}

export function format(json: string, config: Config): string {
  return stringify(sortRoot(arraynize(JSON.parse(json)), config));
}
