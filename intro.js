(function(){
  const ALBUM_URL = "album.html";

  const skipBtn = document.getElementById("skipBtn");
  const foot = document.querySelector(".foot");

  function goAlbum(){
    location.href = ALBUM_URL;
  }

  // Botón entra al álbum (sin auto-redirect)
  if (skipBtn) {
    skipBtn.textContent = "Entrar al álbum →";
    skipBtn.addEventListener("click", goAlbum);

    // opcional: habilitar después de 2.5s para que vean la animación
    skipBtn.disabled = true;
    setTimeout(() => {
      skipBtn.disabled = false;
      skipBtn.classList.add("ready");
      if (foot) foot.textContent = "Cuando quieras… entra al álbum ✨";
    }, 2500);
  }
})();
