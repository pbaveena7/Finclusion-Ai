import json
import redis
from functools import wraps
from typing import Any
import hashlib

# Simple connection setup (should ideally pull from config)
redis_client = redis.Redis(host='localhost', port=6379, db=1, decode_responses=True)

def cache_response(ttl_seconds: int = 300):
    """
    Decorator to cache the results of async provider methods in Redis.
    Uses the method name and arguments to create a unique hash key.
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Create a unique cache key based on the function name and arguments
            key_string = f"{func.__name__}:{args}:{kwargs}"
            cache_key = f"finclusion:cache:{hashlib.md5(key_string.encode()).hexdigest()}"
            
            try:
                # Check cache
                cached_data = redis_client.get(cache_key)
                if cached_data:
                    # Return cached JSON as dict (the Pydantic schemas can init from dict)
                    return json.loads(cached_data)
            except redis.ConnectionError:
                print("Redis connection failed, bypassing cache.")
                pass
                
            # Cache miss, execute the function
            result = await func(*args, **kwargs)
            
            try:
                # Cache the result (assuming it's a Pydantic model with a .model_dump_json() method)
                if hasattr(result, 'model_dump_json'):
                    redis_client.setex(cache_key, ttl_seconds, result.model_dump_json())
            except redis.ConnectionError:
                pass
                
            return result
        return wrapper
    return decorator
