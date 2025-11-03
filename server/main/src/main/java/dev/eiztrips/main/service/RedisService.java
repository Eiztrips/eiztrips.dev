package dev.eiztrips.main.service;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class RedisService {
    private final StringRedisTemplate redis;

    public RedisService(StringRedisTemplate redis) {
        this.redis = redis;
    }

    public void saveState(String state, Map<String, String> data) {
        String key = "state:" + state;
        redis.opsForHash().putAll(key, data);
        redis.expire(key, java.time.Duration.ofMinutes(10));
    }

    public void addState(String state, Map<String, String> data) {
        String key = "state:" + state;
        redis.opsForHash().putAll(key, data);
    }

    public Map<String, String> getState(String state) {
        String key = "state:" + state;
        return redis.<String, String>opsForHash().entries(key);
    }

    public void removeState(String state) {
        String key = "state:" + state;
        redis.delete(key);
    }
}