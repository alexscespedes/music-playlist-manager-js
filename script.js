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

  const song = { title, artist, genre };
  songs.push(song);
  saveToLocalStorage();
  renderSong(song);

  // Clear inputs
  titleInput.value = "";
  artistInput.value = "";
  genreInput.value = "";

  updateTotalSongs();
  updatedGenreFilterOption();
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
    updatedGenreFilterOption();
  }
}

function renderSong(song) {
  const row = document.createElement("tr");

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

  if (isEditing) {
    const updatedTitle = cells[0].querySelector("input").value.trim();
    const updatedArtist = cells[1].querySelector("input").value.trim();
    const updatedGenre = cells[2].querySelector("input").value.trim();

    if (!updatedTitle || !updatedArtist || !updatedGenre) {
      alert("All fields are required.");
      return;
    }

    // Save updates to UI
    cells[0].querySelector(".text").textContent = updatedTitle;
    cells[1].querySelector(".text").textContent = updatedArtist;
    cells[2].querySelector(".text").textContent = updatedGenre;

    // Toggle visibility
    for (let i = 0; i < 3; i++) {
      cells[i].querySelector(".text").style.display = "";
      cells[i].querySelector("input").style.display = "none";
    }

    // Update the data
    const originalTitle = button.dataset.originalTitle;
    const originalArtist = button.dataset.originalArtist;
    const index = songs.findIndex(
      (song) => song.title === originalTitle && song.artist === originalArtist
    );

    if (index !== -1) {
      songs[index] = {
        title: updatedTitle,
        artist: updatedArtist,
        genre: updatedGenre,
      };
      saveToLocalStorage();
      updatedGenreFilterOption();
    }

    button.textContent = "Edit";
  } else {
    // Switch to edit mode
    for (let i = 0; i < 3; i++) {
      const textEl = cells[i].querySelector(".text");
      const inputEl = cells[i].querySelector("input");
      if (textEl && inputEl) {
        inputEl.value = textEl.textContent;
        textEl.style.display = "none";
        inputEl.style.display = "";
      }
    }

    button.dataset.originalTitle = cells[0].querySelector(".text").textContent;
    button.dataset.originalArtist = cells[1].querySelector(".text").textContent;

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
