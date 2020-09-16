import alphabeticalSort, {JSONObjectNode} from '@optipack/alphabetical-sorter';
import configurableAlphabeticalSort from '@optipack/configurable-alphabetical-sorter';

export interface Config {
  order: string[];
}

export default function sort(nodes: JSONObjectNode[], config: Partial<Config>) {
  return configurableAlphabeticalSort<ReturnType<typeof combine>[string]>(
    Object.entries(combine(separate(nodes))),
    config,
  ).flatMap(([_, {base, pre, post}]) => [
    ...alphabeticalSort(pre),
    ...alphabeticalSort(base),
    ...alphabeticalSort(post),
  ]);
}

export function separate(
  nodes: JSONObjectNode[],
): {
  [key in string]: {nodes: JSONObjectNode[]};
} {
  return nodes.reduce((prev: ReturnType<typeof separate>, [key, value]) => {
    const keyBase = key.split(':')[0];
    return {
      ...prev,
      [keyBase]: {
        nodes: [...(prev[keyBase]?.nodes || []), [key, value]],
      },
    };
  }, {});
}

export function combine(
  arg: ReturnType<typeof separate>,
): {
  [key in string]: {
    base: JSONObjectNode[];
    pre: JSONObjectNode[];
    post: JSONObjectNode[];
  };
} {
  return Object.fromEntries(
    Object.entries(intereptKeyDependencies(Object.keys(arg))).map(
      ([key, {pre, post}]) => [
        key,
        {
          base: arg[key].nodes,
          pre: pre ? arg[`pre${key}`].nodes : [],
          post: post ? arg[`post${key}`].nodes : [],
        },
      ],
    ),
  );
}

export function intereptKeyDependencies(
  keys: string[],
): {[key in string]: {pre?: string; post?: string}} {
  const prefix = keys.filter(
    (key) => key.startsWith('pre') || key.startsWith('post'),
  );

  const notPrefix = keys.filter((key) => !prefix.includes(key));
  const notPrefixWithPrefix = notPrefix.flatMap((key) => [
    `pre${key}`,
    `post${key}`,
  ]);

  const prefixWithNoBase = prefix
    .filter((key) => !notPrefixWithPrefix.includes(key))
    .map((key) => [key, {}]);

  return {
    ...Object.fromEntries(prefixWithNoBase),
    ...Object.fromEntries(
      notPrefix.map((key) => [
        key,
        {
          ...(prefix.includes(`pre${key}`) ? {pre: `pre${key}`} : {}),
          ...(prefix.includes(`post${key}`) ? {post: `post${key}`} : {}),
        },
      ]),
    ),
  };
}
