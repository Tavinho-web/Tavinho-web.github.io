(function(){
  const ALBUM_URL = "album.html";
  const CODE = "011125";

  // Si ya entró antes, lo mandamos directo
  if (localStorage.getItem("taly_access") === "ok") {
    location.href = ALBUM_URL;
    return;
  }

  const form = document.getElementById("loginForm");
  const input = document.getElementById("code");
  const msg = document.getElementById("msg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const val = (input.value || "").trim();

    if (val === CODE) {
      localStorage.setItem("taly_access", "ok");
      msg.textContent = "Listo 💛 entrando al álbum…";
      setTimeout(() => location.href = ALBUM_URL, 400);
    } else {
      msg.textContent = "Código incorrecto 🙈 intenta otra vez.";
      input.value = "";
      input.focus();
    }
  });
})();
