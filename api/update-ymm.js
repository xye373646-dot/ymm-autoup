// /api/update-ymm.js
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const body = req.body;

    const { brand, model, year } = body;

    if (!brand || !model || !year) {
      return res.status(400).json({
        error: 'Missing brand/model/year',
      });
    }

    const key = `ymm:${brand}:${model}:${year}`;

    const data = {
      brand,
      model,
      year,
      updatedAt: Date.now(),
    };

    await redis.set(key, data);

    return res.status(200).json({
      success: true,
      message: 'YMM updated',
      key,
    });

  } catch (error) {
    return res.status(500).json({
      error: error.toString(),
    });
  }
}


