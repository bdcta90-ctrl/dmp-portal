const SHEETS_URL = "https://script.google.com/macros/s/AKfycbzauEgPU4-WFj_pexS5KLmHyCxOd6BGSMc5UKb1HTm-iPD1kvK0-9LqgGpvRDMc1dhI/exec";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      const response = await fetch(SHEETS_URL);
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const response = await fetch(SHEETS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
        redirect: "follow",
      });
      const data = await response.json();
      return res.status(200).json(data);
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}