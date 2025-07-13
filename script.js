const audio = document.getElementById("audio");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const playPauseBtn = document.getElementById("playPauseBtn");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const songTitleEl = document.getElementById("songTitle");
const artistEl = document.getElementById("artist");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const albumImage = document.getElementById("albumImage");
const background = document.querySelector(".background");

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

function updateProgressBar(percent) {
  progressBar.style.background = `linear-gradient(to right, #4299e1 ${percent}%, #4a5568 ${percent}%)`;
  progressBar.value = percent;
}

playPauseBtn.addEventListener("click", () => {
  if (audio.src === "") return;
  if (audio.paused) {
    audio.play();
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
  } else {
    audio.pause();
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
  }
});

audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / 30) * 100;
  updateProgressBar(percent);
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

progressBar.addEventListener("input", () => {
  const percent = progressBar.value;
  updateProgressBar(percent);
  audio.currentTime = (percent / 100) * 30;
});

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (!query) return;

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = false;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      const response = JSON.parse(this.responseText);

      if (!response.data || response.data.length === 0) {
        songTitleEl.textContent = "No results";
        artistEl.textContent = "";
        audio.src = "";
        albumImage.src = "";
        albumImage.style.display = "none";
        background.style.backgroundImage = "";
        return;
      }

      const track = response.data[0];
      songTitleEl.textContent = track.title;
      artistEl.textContent = track.artist.name;
      audio.src = track.preview;

      // Set cover image and show it
      albumImage.src = track.album.cover_medium;
      albumImage.style.display = "block";

      // Set blurred background
      background.style.backgroundImage = `url('${track.album.cover_medium}')`;

      // Reset playback
      audio.pause();
      audio.currentTime = 0;
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
      updateProgressBar(0);
      currentTimeEl.textContent = "0:00";
    }
  });

  xhr.open("GET", `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(query)}`);
  xhr.setRequestHeader("x-rapidapi-key", "bd22a99ca8msh2bb5e1693ee7702p1a8e5fjsn4c36369ccfa0");
  xhr.setRequestHeader("x-rapidapi-host", "deezerdevs-deezer.p.rapidapi.com");
  xhr.send();
});
