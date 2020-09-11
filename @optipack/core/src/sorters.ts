import {ascending} from 'alpha-sort';
import {Config} from './configs';
import {sortScriptsKeys} from './scripts';

export type Node = [string, string | string[] | Node[]];
export type Sorter = (nodes: Node[]) => Node[];

export const sortNodes = (
  nodes: Node[],
  compare: Sorter = alphabeticalSorter,
) => {
  return compare(nodes);
};

export const alphabeticalSorter: Sorter = (nodes) =>
  nodes.sort(([left], [right]) => ascending(left, right));

export const scriptsSorter: Sorter = (scripts) => {
  const obj = Object.fromEntries(scripts);
  return sortScriptsKeys(scripts.map(([key]) => key)).map((key) => [
    key,
    obj[key],
  ]);
};

export const generateRootSorter: (config: Config) => Sorter = ({order}) => (
  nodes,
) => {
  const obj = Object.fromEntries(nodes);
  const keys = Object.keys(obj);
  const configed: Node[] = order
    .filter((key) => keys.includes(key))
    .map((key) => [key, obj[key]]);
  return [
    ...configed,
    ...alphabeticalSorter(nodes.filter(([key]) => !order.includes(key))),
  ];
};
