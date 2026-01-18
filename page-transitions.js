(function () {
  const reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Si el usuario prefiere menos movimiento, no hacemos nada
  if (reduce) {
    document.body.classList.add("is-ready");
    return;
  }

  const DURATION = 220; // ms (fade-out)

  function markReady() {
    document.body.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", markReady);
  } else {
    markReady();
  }

  // Si vuelves con el botón "atrás" (bfcache), quita el leaving
  window.addEventListener("pageshow", () => {
    document.body.classList.remove("is-leaving");
    document.body.classList.add("is-ready");
  });

  function isInternalLink(a) {
    try {
      const url = new URL(a.href, location.href);
      return url.origin === location.origin;
    } catch {
      return false;
    }
  }

  function go(href) {
    document.body.classList.add("is-leaving");
    setTimeout(() => {
      location.href = href;
    }, DURATION);
  }

  // Disponible para tus otros scripts (welcome.js, logout, etc.)
  window.go = go;

  // Intercepta clicks en <a> internos para hacer fade-out
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    // No tocar externos, _blank, descargas, etc.
    if (a.target === "_blank" || a.hasAttribute("download")) return;
    if (!isInternalLink(a)) return;

    e.preventDefault();
    go(a.href);
  });

  // ===== Logout button (seguro) =====
  document.addEventListener(
    "click",
    (e) => {
      const btn = e.target.closest("#logoutBtn");
      if (!btn) return;

      e.preventDefault();
      e.stopImmediatePropagation(); // evita que otro handler lo pise

      localStorage.removeItem("taly_access");
      go("index.html");
    },
    true // capture: corre primero
  );
})();
