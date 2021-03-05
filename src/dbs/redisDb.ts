import redis from 'redis';

const redisClient = redis.createClient({
    host: process.env.SESSION_DB_HOST,
    port: process.env.SESSION_DB_PORT as unknown as number,
    retry_strategy: () => 1000
  });

export default redisClient;
