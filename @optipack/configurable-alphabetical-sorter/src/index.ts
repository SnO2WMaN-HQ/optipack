import alphabeticalSort from '@optipack/alphabetical-sorter';

export interface Config {
  order: string[];
}

export default function sort<T>(
  nodes: [string, T][],
  config: Partial<Config>,
): [string, T][] {
  const order = config?.order || [];

  const object = Object.fromEntries(nodes);
  const keys = Object.keys(object);
  const included: [string, T][] = order
    .filter((key) => keys.includes(key))
    .map((key) => [key, object[key]]);

  const notIncluded = nodes.filter(([key]) => !order.includes(key));

  return [...included, ...alphabeticalSort<T>(notIncluded)];
}
