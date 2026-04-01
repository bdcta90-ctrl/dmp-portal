const SHEETS_URL = "https://script.google.com/macros/s/AKfycbyHqeoSHB7-N4LAQUB6mtVPLshGgcyzubQ9YorvjeFk1twR5WLpRicUP66IwJsQWin1fw/exec";

export default async function handler(req, res) {
  const allowed = ["https://dmp-portal.vercel.app", "https://dmp-portal.vercel.app/"];
  const origin = req.headers.origin || "";
  if (allowed.some(a => origin.startsWith(a))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "https://dmp-portal.vercel.app");
  }
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
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        return res.status(200).json({ success: true, ...data });
      } catch {
        // Apps Script 리다이렉트 응답 — 데이터는 전송됨
        return res.status(200).json({ success: true, result: "logged" });
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
