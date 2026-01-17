(function () {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("confetti")) return;

  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Quita el parámetro para que no salga confeti en cada refresh
  params.delete("confetti");
  const newUrl =
    window.location.pathname +
    (params.toString() ? "?" + params.toString() : "") +
    window.location.hash;
  window.history.replaceState(null, "", newUrl);

  if (reduceMotion) return;

  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });

  let W = 0, H = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener("resize", resize);
  resize();

  const isMobile =
    window.matchMedia && window.matchMedia("(max-width: 520px)").matches;

  const COLORS = ["#ff4fd8", "#7c5cff", "#22d3ee", "#34d399", "#fbbf24", "#ffffff"];
  const COUNT = isMobile ? 240 : 180;
  const duration = 2200;

  const rand = (a, b) => Math.random() * (b - a) + a;

  const originX = W * 0.5;
  const originY = -20;

  const pieces = Array.from({ length: COUNT }, () => ({
    x: originX + rand(-W * 0.35, W * 0.35),
    y: originY + rand(-60, 20),
    w: rand(isMobile ? 10 : 8, isMobile ? 16 : 12),
    h: rand(isMobile ? 14 : 10, isMobile ? 22 : 16),
    vx: rand(-1.2, 1.2),
    vy: rand(2.6, 5.4),
    rot: rand(0, Math.PI * 2),
    vr: rand(-0.18, 0.18),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: rand(0.75, 1),
  }));

  const start = performance.now();

  function tick(t) {
    const elapsed = t - start;
    const k = Math.min(elapsed / duration, 1); // 0..1

    ctx.clearRect(0, 0, W, H);

    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03; // gravedad
      p.rot += p.vr;

      if (p.x < -30) p.x = W + 30;
      if (p.x > W + 30) p.x = -30;

      ctx.save();
      ctx.globalAlpha = p.alpha * (1 - k * 0.6);
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (elapsed < duration) {
      requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, W, H);
      canvas.style.display = "none";
      window.removeEventListener("resize", resize);
    }
  }

  requestAnimationFrame(tick);
})();

