// Get DOM elements

const playlist = document.getElementById("playlist");
const totalSongs = document.getElementById("total-songs");
const genreFilter = document.getElementById("genre-filter");

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

  const song = {
    id: Date.now(),
    title,
    artist,
    genre,
  };

  songs.push(song);
  renderSong(song);
  saveToLocalStorage();
  renderFilteredSongs(genreFilter.value);
  updatedGenreFilterOption();

  // Clear inputs
  titleInput.value = "";
  artistInput.value = "";
  genreInput.value = "";

  updateTotalSongs();
}

// Delete Song Function

function deleteSong(button) {
  const row = button.parentElement.parentElement;
  const songId = parseInt(row.dataset.id);

  // Remove from songs array
  const index = songs.findIndex((song) => song.id === songId);
  if (index !== -1) {
    songs.splice(index, 1);
    saveToLocalStorage();
    updatedGenreFilterOption();
    renderFilteredSongs(genreFilter.value);
  }

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
    updatedGenreFilterOption();
  }
}

function renderSong(song) {
  const row = document.createElement("tr");
  row.dataset.id = song.id;

  row.innerHTML = `
    <td>
      <span class="text">${song.title}</span>
      <input class="edit-input" type="text" style="display: none;" />
    </td>
    <td>
      <span class="text">${song.artist}</span>
      <input class="edit-input" type="text" style="display: none;" />
    </td>
    <td>
      <span class="text">${song.genre}</span>
      <input class="edit-input" type="text" style="display: none;" />
    </td>
    <td>
      <button onclick="deleteSong(this)">Delete</button>
      <button onclick="toggleEdit(this)">Edit</button>
    </td>
  `;

  playlist.appendChild(row);
}

function toggleEdit(button) {
  const row = button.closest("tr");
  const cells = row.querySelectorAll("td");
  const isEditing = button.textContent === "Save";
  const songId = parseInt(row.dataset.id);

  if (isEditing) {
    const updatedTitle = cells[0].querySelector("input").value.trim();
    const updatedArtist = cells[1].querySelector("input").value.trim();
    const updatedGenre = cells[2].querySelector("input").value.trim();

    if (!updatedTitle || !updatedArtist || !updatedGenre) {
      alert("All fields are required.");
      return;
    }

    // Toggle visibility
    for (let i = 0; i < 3; i++) {
      cells[i].querySelector(".text").textContent = [
        updatedTitle,
        updatedArtist,
        updatedGenre,
      ][i];
      cells[i].querySelector(".text").style.display = "";
      cells[i].querySelector("input").style.display = "none";
    }

    // Update the data
    const index = songs.findIndex((song) => song.id === songId);
    if (index !== -1) {
      songs[index].title = updatedTitle;
      songs[index].artist = updatedArtist;
      songs[index].genre = updatedGenre;
      saveToLocalStorage();
      updatedGenreFilterOption();
      renderFilteredSongs(genreFilter.value);
    }

    button.textContent = "Edit";
  } else {
    for (let i = 0; i < 3; i++) {
      const textEl = cells[i].querySelector(".text");
      const inputEl = cells[i].querySelector("input");
      inputEl.value = textEl.textContent;
      textEl.style.display = "none";
      inputEl.style.display = "";
    }

    button.textContent = "Save";
  }
}

genreFilter.addEventListener("change", function () {
  const selectedGenre = genreFilter.value;
  renderFilteredSongs(selectedGenre);
});

function renderFilteredSongs(filterGenre = "All") {
  playlist.innerHTML = "";

  const filteredSongs = songs.filter((song) =>
    filterGenre === "All" ? true : song.genre === filterGenre
  );

  filteredSongs.forEach((song) => renderSong(song));
}

function updatedGenreFilterOption() {
  const uniqueGenres = [...new Set(songs.map((song) => song.genre))];
  genreFilter.innerHTML = `<option value="All">All</option>`;

  uniqueGenres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreFilter.appendChild(option);
  });
}

window.addEventListener("DOMContentLoaded", loadFromLocalStorage);
