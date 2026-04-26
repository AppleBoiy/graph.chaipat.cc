import Redis from 'ioredis';

if (!process.env.REDIS_URL && process.env.NODE_ENV !== 'production') {
  console.warn('WARNING: REDIS_URL is not defined in graph project environment variables.');
}

const createRedisInstance = () => {
  const urlString = process.env.REDIS_URL;
  if (!urlString) return new Redis({ maxRetriesPerRequest: null });

  try {
    const url = new URL(urlString);
    return new Redis({
      host: url.hostname,
      port: url.port ? parseInt(url.port) : 6379,
      username: url.username || undefined,
      password: url.password || undefined,
      db: url.pathname && url.pathname !== '/' ? parseInt(url.pathname.substring(1)) : 0,
      maxRetriesPerRequest: null,
    });
  } catch (e) {
    return new Redis(urlString, { maxRetriesPerRequest: null });
  }
};

const redis = createRedisInstance();

redis.on('error', (err) => {
  if (err.code !== 'ECONNREFUSED') {
    console.error('Redis Pulse Error:', err);
  }
});

export default redis;
