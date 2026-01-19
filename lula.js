(function(){
  const ALBUM_URL = "album.html";
  const btn = document.getElementById("skipBtn");

  function goAlbum(){
    location.href = ALBUM_URL;
  }

  if (btn) {
    btn.addEventListener("click", goAlbum);
  }
})();
