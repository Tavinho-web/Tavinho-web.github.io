const tiles = Array.from(document.querySelectorAll(".tile"));
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");
const mImg = document.getElementById("mImg");
const mTitle = document.getElementById("mTitle");
const mText = document.getElementById("mText");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let lastFocused = null;
let currentIndex = 0;

function renderFromTile(tile){
  const img = tile.querySelector("img");
  mImg.src = img.src;
  mImg.alt = img.alt;
  mTitle.textContent = tile.dataset.title || "Recuerdo";
  mText.textContent = tile.dataset.text || "";
}

function openModal(tile){
  lastFocused = document.activeElement;
  currentIndex = Number(tile.dataset.index || 0);
  renderFromTile(tile);
  modal.hidden = false;

  closeBtn.focus();
  document.body.style.overflow = "hidden";
}

function closeModal(){
  modal.hidden = true;
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

tiles.forEach(tile => {
  tile.addEventListener("click", () => openModal(tile));
});

closeBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

function go(delta){
  currentIndex = (currentIndex + delta + tiles.length) % tiles.length;
  renderFromTile(tiles[currentIndex]);
}

prevBtn.addEventListener("click", () => go(-1));
nextBtn.addEventListener("click", () => go(1));

document.addEventListener("keydown", (e) => {
  if (modal.hidden) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowLeft") go(-1);
  if (e.key === "ArrowRight") go(1);
});

// ===== Cerrar sesión (logout) =====
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("taly_access");
    window.location.href = "index.html";
  });
}
