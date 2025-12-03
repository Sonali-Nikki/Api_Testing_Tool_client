export async function apiRequest(url, options = {}) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeout);


    if (!res.ok) {
      const text = await res.text();

      return {
        success: false,
        error: text || "Server error",
        status: res.status,
      };
    }

    const data = await res.json();

    return {
      success: true,
      data,
    };
  } catch (err) {

    if (err.name === "AbortError") {
      return { success: false, error: "Request Timeout (10s)" };
    }

    if (err.message.includes("Failed to fetch")) {
      return { success: false, error: "Network error / CORS blocked" };
    }

    return { success: false, error: err.message };
  }
}
