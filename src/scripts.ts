import {ascending} from 'alpha-sort';

export const sort = (scripts: {[key in string]: string}) => {
  return sortScriptsKeys(Object.keys(scripts)).map((key) => [
    key,
    scripts[key],
  ]);
};

export function sortScriptsKeys(keys: string[]): string[] {
  return separateByUniqueKeys(keys)
    .map(separateDetailed)
    .sort(([keyA], [keyB]) => ascending(keyA, keyB))
    .map(([_, detail]) => [...detail.pre, ...detail.base, ...detail.post])
    .flat();
}

export function separateDetailed(
  keys: string[],
): [string, {[key in 'pre' | 'base' | 'post']: string[]}] {
  const key = keys
    .sort((left, right) => left.length - right.length)[0]
    .split(':')[0];
  return [
    key,
    {
      pre: keys
        .filter((val) => val !== key && val.startsWith('pre'))
        .sort(ascending),
      base: keys
        .filter(
          (val) =>
            val === key || (!val.startsWith('pre') && !val.startsWith('post')),
        )
        .sort(ascending),
      post: keys
        .filter((val) => val !== key && val.startsWith('post'))
        .sort(ascending),
    },
  ];
}

export function extractUniqueKey(array: string[]): string[] {
  return [
    ...new Set(
      array.map((key) => {
        const base = key.split(':')[0];
        if (base.startsWith('pre')) return base.substring(3);
        if (base.startsWith('post')) return base.substring(4);
        return base;
      }),
    ),
  ];
}

export function separateByUniqueKeys(array: string[]): string[][] {
  return [...extractUniqueKey(array)].map((key) =>
    array.filter((val) => new RegExp(`^(pre|post)?${key}(:.*)?$`).test(val)),
  );
}
