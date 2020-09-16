import alphabeticalSort, {JSONObjectNode} from '@optipack/alphabetical-sorter';

export interface Config {
  order: string[];
}

export default function sort(
  nodes: JSONObjectNode[],
  config: Partial<Config>,
): JSONObjectNode[] {
  const order = config?.order || [];

  const object = Object.fromEntries(nodes);
  const keys = Object.keys(object);
  const included: JSONObjectNode[] = order
    .filter((key) => keys.includes(key))
    .map((key) => [key, object[key]]);

  const notIncluded = nodes.filter(([key]) => !order.includes(key));

  return [...included, ...alphabeticalSort(notIncluded)];
}
