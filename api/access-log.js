const SHEETS_URL = "https://script.google.com/macros/s/AKfycbzauEgPU4-WFj_pexS5KLmHyCxOd6BGSMc5UKb1HTm-iPD1kvK0-9LqgGpvRDMc1dhI/exec";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      // 접속자 IP 추출
      const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim()
        || req.headers["x-real-ip"]
        || req.connection?.remoteAddress
        || "unknown";

      const logData = {
        ...req.body,
        ip: ip,
        serverTime: new Date().toISOString(),
        sheet: "접속이력"  // Google Apps Script에서 시트 구분용
      };

      const response = await fetch(SHEETS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logData),
        redirect: "follow",
      });
      const data = await response.json();
      return res.status(200).json({ success: true, ...data });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
