import {ascending} from 'alpha-sort';

export default function sort<T>(nodes: [string, T][]): [string, T][] {
  return nodes.sort(([left], [right]) => ascending(left, right));
}
