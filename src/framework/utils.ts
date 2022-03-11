export function isArray(a: any): boolean {
  return Array.isArray(a);
}

export function isObject(o: any): boolean {
  return Object.prototype.toString.call(o) === '[object Object]';
}

export function toCamel(s: string): string {
  return s.replace(/([-_][a-z])/gi, ($1) =>
    $1.toUpperCase().replace('-', '').replace('_', '')
  );
}

export function toSnake(s: string): string {
  return s
    .split(/(?=[A-Z])/)
    .join('_')
    .toLowerCase();
}

export function keysToCamel(o: any): any {
  if (isObject(o)) {
    return Object.keys(o).reduce(
      (acc, k) => ({
        ...acc,
        [toCamel(k)]: keysToCamel(o[k])
      }),
      {}
    );
  }

  if (isArray(o)) {
    return o.map((i: any) => keysToCamel(i));
  }

  return o;
}

export function keysToSnake(o: any): any {
  if (isObject(o)) {
    return Object.keys(o).reduce(
      (acc, k) => ({
        ...acc,
        [toSnake(k)]: keysToSnake(o[k])
      }),
      {}
    );
  }

  if (isArray(o)) {
    return o.map((i: any) => keysToSnake(i));
  }

  return o;
}

export function sleep(ms: number) {
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
