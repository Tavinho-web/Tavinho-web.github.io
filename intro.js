(function(){
  const ALBUM_URL = "album.html";

  // Botón entrar al álbum (con delay opcional)
  const skipBtn = document.getElementById("skipBtn");
  if (skipBtn) {
    skipBtn.disabled = true;
    setTimeout(() => {
      skipBtn.disabled = false;
    }, 1200);

    skipBtn.addEventListener("click", () => {
      location.href = ALBUM_URL;
    });
  }

  // ===== Modal gallery tipo album =====
  const tiles = Array.from(document.querySelectorAll(".tile[data-src]"));
  const modal = document.getElementById("modal");
  const mImg = document.getElementById("mImg");
  const mBadge = document.getElementById("mBadge");
  const closeBtn = document.getElementById("closeBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let idx = 0;

  function openAt(i){
    idx = (i + tiles.length) % tiles.length;
    const t = tiles[idx];
    const src = t.getAttribute("data-src");
    const alt = t.querySelector("img")?.getAttribute("alt") || "Foto";

    if (!src) return;

    mImg.src = src;
    mImg.alt = alt;
    mBadge.textContent = String(idx + 1);

    modal.hidden = false;
    document.body.classList.add("noScroll");
  }

  function close(){
    modal.hidden = true;
    document.body.classList.remove("noScroll");
    mImg.src = "";
  }

  function prev(){ openAt(idx - 1); }
  function next(){ openAt(idx + 1); }

  tiles.forEach((t, i) => t.addEventListener("click", () => openAt(i)));

  closeBtn?.addEventListener("click", close);
  prevBtn?.addEventListener("click", prev);
  nextBtn?.addEventListener("click", next);

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!modal || modal.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });
})();
