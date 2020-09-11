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
          return [key, value];
      }
    }),
    generateRootSorter(config),
  );
};

export function arraynize(object: object): Node[] {
  return Object.entries(object).map(([key, value]) => [
    key,
    typeof value === 'string' ? value : arraynize(value),
  ]);
}

export const dearranize = (nodes: Node[]): string => {
  const element = nodes
    .map(([key, value]) => [
      key,
      typeof value === 'string' ? `"${value}"` : dearranize(value),
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
