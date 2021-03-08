import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL, {
    connectTimeout: 10000,
    db: 0,
    family: 4
})

export default redisClient
