// redis-client.js
import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();
client.on('error', (err) => {
  // console.log('Redis Client Error', err);
});
client.on('connect', () => {
  // console.log('Connected!');
});

const getAsync = promisify(client.get).bind(client);
// Set a TTL : client.set(key, value, 'EX', 60 * 60 * 24, callback);
const setAsync = promisify(client.set).bind(client);
const expireAsync = promisify(client.expire).bind(client);
const delAsync = promisify(client.del).bind(client);
// NOTE : do not use keys in production :
// it might block the redis server ; see SCAN documentation instead
// keysAsync: promisify(client.keys).bind(client),

/**
 * Build the cache key
 *
 * @param {string} namespace - base namespace for the cache key
 * @param {Object} params - optional params to build the cache key
 * @returns {string} a string representing the cache key formated using the namespace
 * and each key/value of the params separated by ':'
 * Keys from params must be sorted in alphabetical order.
 *
 * Example : <namespace>:<k1>:<v1>:<k2>:<v2>
 */
const getCacheKey = (namespace: string, params: any) => {
  const paramsEntries = Object.entries(params).sort(([k1], [k2]) =>
    k1 < k2 ? -1 : 1
  );
  const cacheKey = paramsEntries.reduce(
    (acc, [k, v]) => `${acc}:${k}:${v}`,
    namespace
  );
  return cacheKey;
};

export function retrieve(namespace: string, params: any): Promise<any> {
  const cacheKey = getCacheKey(namespace, params);
  return getAsync(cacheKey)
    .then((result) => result && JSON.parse(result))
    .catch(() => null);
}

export function cache(
  namespace: string,
  params: any,
  data: any
): Promise<number> {
  const cacheKey = getCacheKey(namespace, params);
  return setAsync(cacheKey, JSON.stringify(data))
    .then(() => expireAsync(cacheKey, 2))
    .then(() => 1)
    .catch(() => 0);
}
