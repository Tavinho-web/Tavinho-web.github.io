const tiles = Array.from(document.querySelectorAll(".tile"));
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");
const mImg = document.getElementById("mImg");
const mTitle = document.getElementById("mTitle");
const mTitleBack = document.getElementById("mTitleBack");
const mText = document.getElementById("mText");
const mBadge = document.getElementById("mBadge");
const mBadgeBack = document.getElementById("mBadgeBack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const tcgCard = document.getElementById("tcgCard");
const tcgInner = document.getElementById("tcgInner");

let lastFocused = null;
let currentIndex = 0;

function setFlipped(on){
  if (!tcgInner) return;
  tcgInner.classList.toggle("isFlipped", !!on);
}

function toggleFlip(){
  if (!tcgInner) return;
  tcgInner.classList.toggle("isFlipped");
}

function renderFromTile(tile){
  const img = tile.querySelector("img");
  
  // Datos del tile
  const title = tile.dataset.title || "Recuerdo";
  const text = tile.dataset.text || "";
  const imageSrc = img.src;
  const imageAlt = img.alt;
  
  // Renderizar frontal (foto)
  mImg.src = imageSrc;
  mImg.alt = imageAlt;
  mTitle.textContent = title;
  
  // Renderizar reverso (texto/lore)
  mTitleBack.textContent = title;
  mText.textContent = text;
  
  // Badges (opcional, puedes personalizarlos)
  const badge = tile.dataset.badge || "✦";
  mBadge.textContent = badge;
  mBadgeBack.textContent = badge;
}

function openModal(tile){
  lastFocused = document.activeElement;
  currentIndex = Number(tile.dataset.index || 0);
  renderFromTile(tile);
  setFlipped(false);
  modal.hidden = false;

  // Focus en la tarjeta TCG
  if (tcgCard) tcgCard.focus();
  document.body.style.overflow = "hidden";
}

function closeModal(){
  modal.hidden = true;
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

// ===== Event listeners =====
tiles.forEach(tile => {
  tile.addEventListener("click", () => openModal(tile));
});

if (closeBtn) {
  closeBtn.addEventListener("click", closeModal);
}

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

function go(delta){
  currentIndex = (currentIndex + delta + tiles.length) % tiles.length;
  renderFromTile(tiles[currentIndex]);
  setFlipped(false);
}

if (prevBtn) prevBtn.addEventListener("click", () => go(-1));
if (nextBtn) nextBtn.addEventListener("click", () => go(1));

document.addEventListener("keydown", (e) => {
  if (modal.hidden) return;
  
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowLeft") go(-1);
  if (e.key === "ArrowRight") go(1);
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    toggleFlip();
  }
});

// ===== Flip card listeners =====
if (tcgCard) {
  tcgCard.addEventListener("click", toggleFlip);

  tcgCard.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFlip();
    }
  });
}
