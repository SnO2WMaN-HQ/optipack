import {ascending} from 'alpha-sort';
import {Config} from './configs';
import {
  alphabeticalSorter,
  generateRootSorter,
  Node,
  scriptsSorter,
  sortNodes,
} from './sorters';

export const sort = (nodes: Node[], config: Config) => {
  return sortNodes(
    nodes.map(([key, value]) => {
      switch (key) {
        case 'scripts':
          return [key, sortNodes(value as Node[], scriptsSorter)];
        case 'engines':
        case 'dependencies':
        case 'devDependencies':
        case 'peerDependencies':
          return [key, sortNodes(value as Node[], alphabeticalSorter)];
        default:
          return [key, isStringArray(value) ? value.sort(ascending) : value];
      }
    }),
    generateRootSorter(config),
  );
};

export function arraynize(object: object): Node[] {
  return Object.entries(object).map(([key, value]) => {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      Array.isArray(value)
    )
      return [key, value];
    return [key, arraynize(value)];
  });
}

export function isNodeArray(val: Node[1]): val is Node[] {
  return Array.isArray(val) && !isStringArray(val);
}

export function isStringArray(val: Node[1]): val is string[] {
  return (
    Array.isArray(val) &&
    val.every((is: string | Node) => typeof is === 'string')
  );
}

export const dearranize = (nodes: Node[]): string => {
  const element = nodes
    .map(([key, value]) => [
      key,
      isNodeArray(value) ? dearranize(value) : JSON.stringify(value),
    ])
    .reduce((pre, [key, value], i, {length}) => {
      const comma = i === length - 1 ? '' : ',';
      return `${pre}"${key}":${value}${comma}`;
    }, '');
  return `{${element}}`;
};

export function format(json: string, config: Config) {
  return dearranize(sort(arraynize(JSON.parse(json)), config));
}
