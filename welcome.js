(function(){
  const ALBUM_URL = "album.html";
  const CODE = "011125";

  function playHeartsBurst() {
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const layer = document.getElementById("fxLayer");
    if (!layer) return;

    const card = document.querySelector(".card");
    const r = card ? card.getBoundingClientRect() : null;
    const cx = r ? r.left + r.width / 2 : window.innerWidth / 2;
    const cy = r ? r.top + r.height / 2 : window.innerHeight / 2;

    const rand = (a, b) => Math.random() * (b - a) + a;
    const emojis = ["💛","✨","💛","💛","✨"]; // más corazones que chispas
    const N = window.matchMedia("(max-width: 520px)").matches ? 16 : 22;

    for (let i = 0; i < N; i++) {
      const el = document.createElement("span");
      el.className = "fxHeart";
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      el.style.setProperty("--x", `${cx}px`);
      el.style.setProperty("--y", `${cy}px`);
      el.style.setProperty("--dx", `${rand(-160, 160)}px`);
      el.style.setProperty("--dy", `${rand(-220, -90)}px`);
      el.style.setProperty("--rot", `${rand(-220, 220)}deg`);
      el.style.setProperty("--s", `${rand(14, 22)}px`);

      layer.appendChild(el);
      el.addEventListener("animationend", () => el.remove(), { once: true });
    }

    // Limpieza extra por si algo queda colgado
    setTimeout(() => {
      layer.querySelectorAll(".fxHeart").forEach((n) => n.remove());
    }, 1200);
  }

  // Si ya entró antes, lo mandamos directo
  if (localStorage.getItem("taly_access") === "ok") {
    (window.go ? window.go(ALBUM_URL) : (location.href = ALBUM_URL));
    return;
  }

  const form = document.getElementById("loginForm");
  const input = document.getElementById("code");
  const msg = document.getElementById("msg");

  const card = document.querySelector(".card");
  const dotEls = Array.from(document.querySelectorAll(".pinDots span"));

  function syncDots(n){
    dotEls.forEach((d, i) => d.classList.toggle("on", i < n));
  }

  input.addEventListener("input", () => {
    const v = (input.value || "").replace(/\D/g, "").slice(0, 6);
    if (v !== input.value) input.value = v;
    syncDots(v.length);
  });
  syncDots(0);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const val = (input.value || "").trim();

    if (val === CODE) {
      localStorage.setItem("taly_access", "ok");
      msg.textContent = "Listo 💛 entrando al álbum…";

      playHeartsBurst();

      // Espera ~1s para que se vea el efecto y luego navega (con transición si existe window.go)
      setTimeout(() => {
        (window.go ? window.go(ALBUM_URL) : (location.href = ALBUM_URL));
      }, 900);
    } else {
      msg.textContent = "Código incorrecto 🙈 intenta otra vez.";
      input.value = "";
      input.focus();

      if (card){
        card.classList.remove("shake");
        void card.offsetWidth; // reflow para que el shake se repita
        card.classList.add("shake");
      }
      syncDots(0);
    }
  });
})();
