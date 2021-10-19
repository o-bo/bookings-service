const isArray = (a) => Array.isArray(a);

const isObject = (o) => Object.prototype.toString.call(o) === '[object Object]';

const toCamel = (s) => s.replace(/([-_][a-z])/gi, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''));

const keysToCamel = (o) => {
  if (isObject(o)) {
    const n = {};

    Object.keys(o).forEach((k) => {
      n[toCamel(k)] = keysToCamel(o[k]);
    });

    return n;
  } if (isArray(o)) {
    return o.map((i) => keysToCamel(i));
  }

  return o;
};

module.exports = {
  isObject,
  isArray,
  toCamel,
  keysToCamel,
};
