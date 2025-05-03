// Get DOM elements

const playlist = document.getElementById("playlist");
const totalSongs = document.getElementById("total-songs");

let songs = [];

// Add Song Function
function addSong() {
  const titleInput = document.getElementById("song-title");
  const artistInput = document.getElementById("song-artist");
  const genreInput = document.getElementById("song-genre");

  const title = titleInput.value.trim();
  const artist = artistInput.value.trim();
  const genre = genreInput.value.trim();

  if (title === "" || artist === "" || genre === "") {
    alert("Please fill in all fields!");
    return;
  }

  // Create a new table row
  const row = document.createElement("tr");

  row.innerHTML = `
  <td>${title}</td>
  <td>${artist}</td>
  <td>${genre}</td>
  <td><button onclick="deleteSong(this)">Delete</button></td>
  `;

  playlist.appendChild(row);

  // Clear inputs
  titleInput.value = "";
  artistInput.value = "";
  genreInput.value = "";

  updateTotalSongs();
}

// Delete Song Function

function deleteSong(button) {
  const row = button.parentElement.parentElement;
  row.remove();
  updateTotalSongs();
}

// Update Total Songs Function

function updateTotalSongs() {
  const rows = playlist.querySelectorAll("tr");
  totalSongs.textContent = rows.length;
}

// Clear Playlist Function
function clearPlaylist() {
  playlist.innerHTML = "";
  updateTotalSongs();
}

// Local Storage
function saveToLocalStorage() {
  localStorage.setItem("playlist", JSON.stringify(songs));
}

function loadFromLocalStorage() {
  const stored = localStorage.getItem("playlist");
  if (stored) {
    songs = JSON.parse(stored);
    songs.forEach((song) => renderSong(song));
    updateTotalSongs();
  }
}
