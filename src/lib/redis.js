import Redis from 'ioredis';

if (!process.env.REDIS_URL && process.env.NODE_ENV !== 'production') {
  console.warn('WARNING: REDIS_URL is not defined in graph project environment variables.');
}

const createRedisInstance = () => {
  const urlString = process.env.REDIS_URL;
  if (!urlString) {
    throw new Error('REDIS_URL is not defined in graph repo.');
  }

  try {

    const url = new URL(urlString);
    const options = {
      host: url.hostname,
      port: url.port ? parseInt(url.port) : 6379,
      username: url.username || undefined,
      password: url.password || undefined,
      db: url.pathname && url.pathname !== '/' ? parseInt(url.pathname.substring(1)) : 0,
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      keepAlive: 10000,
      retryStrategy(times) {
        return Math.min(times * 50, 2000);
      },
    };

    if (url.protocol === 'rediss:') {
      options.tls = { rejectUnauthorized: false };
    }

    return new Redis(options);
  } catch (e) {
    return new Redis(urlString, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      keepAlive: 10000,
      retryStrategy(times) {
        return Math.min(times * 50, 2000);
      },
    });
  }
};

const redis = createRedisInstance();

redis.on('error', (err) => {
  if (err.code !== 'ECONNREFUSED') {
    console.error('Redis Pulse Error:', err);
  }
});

export default redis;
