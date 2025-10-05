export default function handler(req, res) {
  // Clear the token cookie
  res.setHeader(
    "Set-Cookie",
    `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
  );
  res.json({ ok: true });
}
