import redisClient from '../dbs/redisDb'; 

class RedisService {
    setItem(key: string, value: string){
        return redisClient.set(key, value);
    }

    getItem(key: string){
        return redisClient.get(key);
    }

    delItem(key: string) {
        return redisClient.del(key);
    }
}

export const redisService = new RedisService()
