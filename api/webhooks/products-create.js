import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const product = req.body;

  // 从产品中提取需要处理的内容
  const payload = {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.body_html
  };

  // 转发给你的 YMM 自动分析接口
  await fetch(`${process.env.MY_YMM_API}/api/update-ymm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return res.status(200).json({ success: true, message: "New product processed." });
}
