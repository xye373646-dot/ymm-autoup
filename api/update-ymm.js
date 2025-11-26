import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const { handle, title, description } = req.body;

    if (!handle || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const ymmPath = path.join(process.cwd(), "data", "ymm.json");
    let ymmData = [];

    if (fs.existsSync(ymmPath)) {
      ymmData = JSON.parse(fs.readFileSync(ymmPath, "utf8"));
    }

    const matchedYears = [];
    const yearRegex = /\b(19|20)\d{2}\b/g;

    const text = `${title} ${description}`;
    const years = text.match(yearRegex) || [];

    years.forEach((year) => {
      matchedYears.push({
        year,
        handle
      });
    });

    ymmData.push(...matchedYears);

    fs.writeFileSync(ymmPath, JSON.stringify(ymmData, null, 2));

    return res.json({ success: true, added: matchedYears });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
