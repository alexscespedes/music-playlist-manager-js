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

  const song = { title, artist, genre };
  songs.push(song);
  saveToLocalStorage();
  renderSong(song);

  // Clear inputs
  titleInput.value = "";
  artistInput.value = "";
  genreInput.value = "";

  updateTotalSongs();
}

// Delete Song Function

function deleteSong(button) {
  const row = button.parentElement.parentElement;
  const title = row.children[0].textContent;
  const artist = row.children[1].textContent;
  const genre = row.children[2].textContent;

  // Find index and remove from array
  songs = songs.filter(
    (song) =>
      !(song.title === title && song.artist === artist && song.genre === genre)
  );

  saveToLocalStorage();
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
  // Clear DOM
  playlist.innerHTML = "";

  // Clear data
  songs = [];

  // Clear local storage
  localStorage.removeItem("playlist");

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

function renderSong(song) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${song.title}</td>
    <td>${song.artist}</td>
    <td>${song.genre}</td>
    <td><button onclick="deleteSong(this)">Delete</button></td>
    `;

  playlist.appendChild(row);
}

window.addEventListener("DOMContentLoaded", loadFromLocalStorage);
