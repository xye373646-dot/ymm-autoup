// /api/update-ymm.js
import { Redis } from '@upstash/redis';

export const config = {
  runtime: 'edge',
};

// 初始化 Upstash Redis（使用你的环境变量）
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(request) {
  try {
    const body = await request.json();

    const { brand, model, year } = body;

    if (!brand || !model || !year) {
      return new Response(
        JSON.stringify({ error: 'Missing brand/model/year' }),
        { status: 400 }
      );
    }

    const key = `ymm:${brand}:${model}:${year}`;

    const data = {
      brand,
      model,
      year,
      updatedAt: Date.now(),
    };

    await redis.set(key, data);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'YMM updated successfully',
        redisKey: key,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.toString() }),
      { status: 500 }
    );
  }
}


