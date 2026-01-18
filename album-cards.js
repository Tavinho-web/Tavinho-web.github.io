(function () {
  const tiles = Array.from(document.querySelectorAll(".tile"));

  function buildCard(tile) {
    const img = tile.querySelector("img");
    const oldBadge = tile.querySelector(".badge");

    const title = tile.dataset.title || "Recuerdo";
    const text = tile.dataset.text || "";
    const num = oldBadge ? oldBadge.textContent.trim() : String((Number(tile.dataset.index || 0) + 1));

    // Limpia el botón
    tile.innerHTML = "";
    tile.classList.add("cardTile");
    tile.setAttribute("type", "button");
    tile.setAttribute("aria-label", `${title}. Toca para voltear`);

    const inner = document.createElement("div");
    inner.className = "cardInner";

    // ===== FRONT =====
    const front = document.createElement("div");
    front.className = "cardFace cardFront";

    const header = document.createElement("div");
    header.className = "cardHeader";

    const name = document.createElement("div");
    name.className = "cardName";
    name.textContent = title;

    const badgeF = document.createElement("span");
    badgeF.className = "cardBadge";
    badgeF.textContent = num;

    header.append(name, badgeF);

    const art = document.createElement("div");
    art.className = "cardArt";
    art.appendChild(img);

    const footer = document.createElement("div");
    footer.className = "cardFooter";
    footer.textContent = "Toca para voltear ↻";

    front.append(header, art, footer);

    // ===== BACK =====
    const back = document.createElement("div");
    back.className = "cardFace cardBack";

    const bHeader = document.createElement("div");
    bHeader.className = "backHeader";

    const bName = document.createElement("div");
    bName.className = "backName";
    bName.textContent = title;

    const badgeB = document.createElement("span");
    badgeB.className = "cardBadge";
    badgeB.textContent = num;

    bHeader.append(bName, badgeB);

    const body = document.createElement("div");
    body.className = "backBody";

    const p = document.createElement("p");
    p.className = "backText";
    p.textContent = text;

    body.appendChild(p);

    const bFooter = document.createElement("div");
    bFooter.className = "backFooter";
    bFooter.textContent = "Toca para volver ↺";

    back.append(bHeader, body, bFooter);

    inner.append(front, back);
    tile.appendChild(inner);
  }

  function setFlipped(tile, on) {
    tile.classList.toggle("isFlipped", !!on);
    tile.setAttribute("aria-pressed", on ? "true" : "false");
  }

  // Construye cartas
  tiles.forEach(buildCard);

  // Flip en click/tap
  tiles.forEach((tile) => {
    tile.addEventListener("click", () => {
      const now = tile.classList.contains("isFlipped");
      setFlipped(tile, !now);
    });

    tile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        tile.click();
      }
    });
  });

  // ESC: devuelve todas al frente
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") tiles.forEach((t) => setFlipped(t, false));
  });

  // ===== Logout (mantener funcionando) =====
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("taly_access");
      (window.go ? window.go("index.html") : (window.location.href = "index.html"));
    });
  }
})();
