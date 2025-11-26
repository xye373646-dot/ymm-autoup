import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  try {
    const { handle, title, description } = req.body;

    if (!handle || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 读取现有数据
    const ymmData = (await kv.get("ymm")) || [];

    const match = `${title} ${description}`.match(/\b(19|20)\d{2}\b/g) || [];

    const added = [];

    match.forEach((year) => {
      added.push({
        year,
        handle,
      });
    });

    // 添加新数据
    await kv.set("ymm", [...ymmData, ...added]);

    return res.json({
      success: true,
      added,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

