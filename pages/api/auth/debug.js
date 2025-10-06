export default function handler(req, res) {
  // Return the raw cookie header and parsed cookies to help debugging
  const raw = req.headers.cookie || "";
  const parsed = raw
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [k, v] = s.split("=");
      return { k, v };
    });
  res.status(200).json({ raw, parsed });
}
