import Redis from 'ioredis';

if (!process.env.REDIS_URL && process.env.NODE_ENV !== 'production') {
  console.warn('WARNING: REDIS_URL is not defined in graph project environment variables.');
}

const getRedisOptions = () => {
  if (!process.env.REDIS_URL) return {};
  try {
    const url = new URL(process.env.REDIS_URL);
    return {
      host: url.hostname,
      port: parseInt(url.port),
      username: url.username,
      password: url.password,
      db: url.pathname ? parseInt(url.pathname.substring(1)) : 0,
    };
  } catch (e) {
    return process.env.REDIS_URL;
  }
};

const redis = new Redis(getRedisOptions(), {
  maxRetriesPerRequest: null,
});

redis.on('error', (err) => {
  if (err.code !== 'ECONNREFUSED') {
    console.error('Redis Pulse Error:', err);
  }
});

export default redis;
