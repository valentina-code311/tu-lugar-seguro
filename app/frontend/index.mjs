import http from "http";
import https from "https";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const SITE_URL = process.env.SITE_URL || "https://tulugarseguro.com";
const PORT = 3001;

const FALLBACK_IMG = `${SITE_URL}/favicon.png`;
const FALLBACK_DESC = "Psicología con contexto, claridad, criterio y cambios reales.";

function fetchJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    lib.get(url, { headers }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error("Invalid JSON")); }
      });
    }).on("error", reject);
  });
}

function escape(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function stripHtml(html = "") {
  return html.replace(/<[^>]+>/g, "").slice(0, 160);
}

function buildHtml({ title, description, image, url, publishedAt }) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${escape(title)}</title>
  <meta name="description" content="${escape(description)}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Maryen Chamorro" />
  <meta property="og:title" content="${escape(title)}" />
  <meta property="og:description" content="${escape(description)}" />
  <meta property="og:url" content="${escape(url)}" />
  <meta property="og:image" content="${escape(image)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  ${publishedAt ? `<meta property="article:published_time" content="${escape(publishedAt)}" />` : ""}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escape(title)}" />
  <meta name="twitter:description" content="${escape(description)}" />
  <meta name="twitter:image" content="${escape(image)}" />
  <meta http-equiv="refresh" content="0;url=${escape(url)}" />
</head>
<body>
  <p>Redirigiendo a <a href="${escape(url)}">${escape(title)}</a>…</p>
</body>
</html>`;
}

const server = http.createServer(async (req, res) => {
  const match = req.url?.match(/^\/escritos\/([^/?#]+)/);

  if (!match) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const slug = match[1];

  try {
    const apiUrl =
      `${SUPABASE_URL}/rest/v1/escritos` +
      `?slug=eq.${encodeURIComponent(slug)}` +
      `&status=eq.published` +
      `&select=title,excerpt,cover_image,slug,published_at` +
      `&limit=1`;

    const rows = await fetchJson(apiUrl, {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    });

    const escrito = rows?.[0];
    if (!escrito) {
      res.writeHead(404);
      res.end("Escrito no encontrado");
      return;
    }

    const url = `${SITE_URL}/escritos/${escrito.slug}`;
    const html = buildHtml({
      title: `${escrito.title} | Maryen Chamorro`,
      description: escrito.excerpt ? stripHtml(escrito.excerpt) : FALLBACK_DESC,
      image: escrito.cover_image || FALLBACK_IMG,
      url,
      publishedAt: escrito.published_at,
    });

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  } catch (err) {
    console.error("bot-server error:", err.message);
    res.writeHead(500);
    res.end("Error interno");
  }
});

server.listen(PORT, () => {
  console.log(`bot-server escuchando en :${PORT}`);
});
