import { Redis } from "@upstash/redis";

export const config = {
  runtime: "edge",
};

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req) {
  try {
    const body = await req.json();

    // 你可以根据你的逻辑处理
    await redis.set("last_update", JSON.stringify(body));

    return new Response(
      JSON.stringify({ success: true, message: "YMM updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}



