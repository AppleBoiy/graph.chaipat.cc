import Redis from 'ioredis';

if (!process.env.REDIS_URL && process.env.NODE_ENV !== 'production') {
  console.warn('WARNING: REDIS_URL is not defined in graph project environment variables.');
}

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redis.on('error', (err) => {
  if (err.code !== 'ECONNREFUSED') {
    console.error('Redis Pulse Error:', err);
  }
});

export default redis;
