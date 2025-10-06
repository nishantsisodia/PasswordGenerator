export default function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET")
    return res.status(405).end();
  // Clear the token cookie reliably: set Expires and Max-Age=0.
  // Only add Secure when in production (so it still works on localhost HTTP).
  const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const cookie = `token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; SameSite=Lax${secureFlag}`;
  res.setHeader("Set-Cookie", cookie);
  res.status(200).json({ ok: true });
}
