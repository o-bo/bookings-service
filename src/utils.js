const isArray = (a) => Array.isArray(a);

const isObject = (o) => Object.prototype.toString.call(o) === '[object Object]';

const toCamel = (s) => s.replace(/([-_][a-z])/gi, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''));

const toSnake = (s) => s.split(/(?=[A-Z])/).join('_').toLowerCase();

const keysToCamel = (o) => {
  if (isObject(o)) {
    const n = {};

    Object.keys(o).forEach((k) => {
      n[toCamel(k)] = keysToCamel(o[k]);
    });

    return n;
  }

  if (isArray(o)) {
    return o.map((i) => keysToCamel(i));
  }

  return o;
};

const keysToSnake = (o) => {
  if (isObject(o)) {
    const n = {};

    Object.keys(o).forEach((k) => {
      n[toSnake(k)] = keysToSnake(o[k]);
    });

    return n;
  }

  if (isArray(o)) {
    return o.map((i) => keysToSnake(i));
  }

  return o;
};

const sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

module.exports = {
  isObject,
  isArray,
  toCamel,
  keysToCamel,
  keysToSnake,
  sleep,
};
