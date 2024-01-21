

export const getSlugFromName = (name: string) => {
  return name.replace(/\s+/g, '-').replace(/[^-\w]/g, '').toLowerCase()
}

export function recursivelyNullifyUndefinedValues<T extends Record<string, unknown> | ArrayLike<unknown>>(obj: T): T {
  Object
    .entries(obj)
    .forEach(([key, value]) => {
      if (!!value && (typeof value === 'object')) {

        recursivelyNullifyUndefinedValues(value as Record<string, unknown>);
      } else if (value === undefined) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        obj[key] = null;
      }
    });
  return obj;
}
