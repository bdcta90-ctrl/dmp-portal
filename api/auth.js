import crypto from "crypto";

// 비밀번호 해시 (서버에서만 보유, 클라이언트 번들에 포함 안 됨)
const PW_HASH = "72137cfc58359eb5bfb940d091c9b7179cea8f84b6fb2d5b4977d482d1fa4c4a";
// 토큰 서명용 시크릿 (서버 전용)
const TOKEN_SECRET = "dmp-gate-s3cr3t-k7ds-ax-2026-mvp-portal";
const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1시간

// 간단한 메모리 Rate Limit (Vercel cold start마다 리셋되지만 기본 방어는 됨)
const attempts = {};
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 30 * 60 * 1000;

function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function hmacSign(payload) {
  return crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("hex");
}

function makeToken() {
  const payload = JSON.stringify({ iat: Date.now(), exp: Date.now() + TOKEN_EXPIRY_MS });
  const b64 = Buffer.from(payload).toString("base64url");
  const sig = hmacSign(b64);
  return `${b64}.${sig}`;
}

function verifyToken(token) {
  if (!token || !token.includes(".")) return false;
  const [b64, sig] = token.split(".");
  if (hmacSign(b64) !== sig) return false;
  try {
    const payload = JSON.parse(Buffer.from(b64, "base64url").toString());
    if (payload.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

function getClientIp(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "unknown";
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://dmp-portal.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { action, password, token } = req.body || {};
  const ip = getClientIp(req);

  // 토큰 검증
  if (action === "verify") {
    return res.status(200).json({ valid: verifyToken(token) });
  }

  // 로그인
  if (action === "login") {
    // Rate limit 체크
    const now = Date.now();
    if (!attempts[ip]) attempts[ip] = { count: 0, lockedUntil: 0 };
    const a = attempts[ip];

    if (a.lockedUntil > now) {
      const left = Math.ceil((a.lockedUntil - now) / 1000);
      return res.status(429).json({ error: "locked", remaining: left });
    }

    if (!password) return res.status(400).json({ error: "비밀번호를 입력해주세요" });

    const hash = sha256(password);
    if (hash === PW_HASH) {
      // 성공 → 카운터 리셋, 토큰 발급
      attempts[ip] = { count: 0, lockedUntil: 0 };
      return res.status(200).json({ success: true, token: makeToken() });
    } else {
      // 실패
      a.count += 1;
      if (a.count >= MAX_ATTEMPTS) {
        a.lockedUntil = now + LOCKOUT_MS;
        return res.status(429).json({
          error: "locked",
          remaining: Math.ceil(LOCKOUT_MS / 1000),
          message: `${MAX_ATTEMPTS}회 실패 — 30분 차단`,
        });
      }
      return res.status(401).json({
        error: "wrong",
        attempts: a.count,
        maxAttempts: MAX_ATTEMPTS,
      });
    }
  }

  return res.status(400).json({ error: "Invalid action" });
}
