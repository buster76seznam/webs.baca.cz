import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

async function clearLimits() {
  const ip = '::1';
  console.log(`Clearing limits for IP: ${ip}`);
  await redis.del(`gen_limit:ip:${ip}`);
  console.log('✅ IP limit cleared');
  
  // Also clear any fingerprints we might have used
  const keys = await redis.keys('gen_limit:fp:*');
  if (keys.length > 0) {
    await redis.del(...keys);
    console.log(`✅ ${keys.length} fingerprint limits cleared`);
  }
}

clearLimits();
