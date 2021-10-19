// redis-client.js
const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient(process.env.REDIS_URL || 'localhost:6379');

module.exports = {
  ...client,
  getAsync: promisify(client.get).bind(client),
  // Set a TTL : client.set(key, value, 'EX', 60 * 60 * 24, callback);
  setAsync: promisify(client.set).bind(client),
  delAsync: promisify(client.del).bind(client),
  // NOTE : do not use it in production :
  // it might block the redis server ; see SCAN documentation instead
  // keysAsync: promisify(client.keys).bind(client),
};
