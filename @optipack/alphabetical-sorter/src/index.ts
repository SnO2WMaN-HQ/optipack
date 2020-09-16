import {ascending} from 'alpha-sort';

export type JSONObjectNode = [string, any];

export default function sort(nodes: JSONObjectNode[]): JSONObjectNode[] {
  return nodes.sort(([left], [right]) => ascending(left, right));
}
