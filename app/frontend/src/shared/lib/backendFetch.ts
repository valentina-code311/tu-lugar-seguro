/**
 * POST al backend con timeout automático via AbortController.
 * Si el backend no responde en `timeoutMs`, lanza un error claro
 * y el botón que llama esta función puede ser reintentado.
 */
export async function backendPost(
  url: string,
  body: unknown,
  timeoutMs = 60_000
): Promise<unknown> {
  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(tid);

    if (!resp.ok) {
      let detail = `Error ${resp.status}`;
      try {
        const err = await resp.json();
        detail = err.detail || detail;
      } catch {
        // ignore JSON parse error
      }
      throw new Error(detail);
    }

    return resp.json();
  } catch (e) {
    clearTimeout(tid);

    if (e instanceof DOMException && e.name === "AbortError") {
      throw new Error("La petición tardó demasiado. Verifica que el backend esté activo e intenta de nuevo.");
    }
    if (e instanceof TypeError && (e.message === "Failed to fetch" || e.message.includes("fetch"))) {
      throw new Error("No se pudo conectar al backend. Verifica que esté activo e intenta de nuevo.");
    }

    throw e;
  }
}
