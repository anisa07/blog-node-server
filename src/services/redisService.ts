import redisClient from '../dbs/redisDb'; 

class RedisService {
    setItem(key: string, value: string, ex?: number){
        return redisClient.set(key, value, 'EX', ex || 86400);
    }

    getItem(key: string){
        return redisClient.get(key);
    }

    delItem(key: string) {
        return redisClient.del(key);
    }
}

export const redisService = new RedisService()
