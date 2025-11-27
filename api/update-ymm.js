// /api/update-ymm.js
import { kv } from '@vercel/kv';

export const config = {
  runtime: 'edge', // 适合 webhook，延迟最低
};

export default async function handler(request) {
  try {
    const body = await request.json();

    // Webhook 必须传的字段
    const { brand, model, year } = body;

    if (!brand || !model || !year) {
      return new Response(
        JSON.stringify({ error: 'Missing brand/model/year' }),
        { status: 400 }
      );
    }

    // Redis key：每个 brand-model-year 唯一
    const key = `ymm:${brand}:${model}:${year}`;

    // 存储对象（你可以加更多字段）
    const data = {
      brand,
      model,
      year,
      updatedAt: Date.now(),
    };

    await kv.set(key, data);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'YMM updated successfully',
        redisKey: key,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Invalid JSON or server error',
        details: error.toString(),
      }),
      { status: 500 }
    );
  }
}



