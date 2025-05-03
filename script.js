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
    <td><span class="text">${song.title}</span><input class="edit-input" type="text" style="display:none" /></td>
    <td><span class="text">${song.artist}</span><input class="edit-input" type="text" style="display:none" /></td>
    <td><span class="text">${song.genre}</span><input class="edit-input" type="text" style="display:none" /></td>
    <td>
      <button onclick="deleteSong(this)">Delete</button>
      <button onclick="toogleEdit(this)">Edit</button>
    </td>
    `;

  playlist.appendChild(row);
}

function toogleEdit(button) {
  const row = button.parentElement.parentElement;
  const cells = row.querySelectorAll("td");

  const isEditing = button.textContent === "Save";

  if (isEditing) {
    // Save changes
    const updatedTitle = cells[0].querySelector("input").value.trim();
    const updatedArtist = cells[1].querySelector("input").value.trim();
    const updatedGenre = cells[2].querySelector("input").value.trim();

    if (!updatedTitle || !updatedArtist || !updatedGenre) {
      alert("All fields are required.");
      return;
    }

    // Update display text
    cells[0].querySelector(".text").textContent = updatedTitle;
    cells[1].querySelector(".text").textContent = updatedArtist;
    cells[2].querySelector(".text").textContent = updatedGenre;

    // Hide inputs, show exit
    cells.forEach((cell) => {
      cell.querySelector(".text").style.display = "";
      cell.querySelector(".edit-input").style.display = "none";
    });

    // Update array and save
    const originalTitle = button.dataset.originalTitle;
    const originalArtist = button.dataset.originalArtist;
    // const originalGenre = button.dataset.originalGenre;
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
    }

    button.textContent = "Edit";
  } else {
    // Switch to editing mode
    const title = cells[0].querySelector(".text").textContent;
    const artist = cells[1].querySelector(".text").textContent;
    const genre = cells[2].querySelector(".text").textContent;

    cells[0].querySelector("input").value = title;
    cells[1].querySelector("input").value = artist;
    cells[2].querySelector("input").value = genre;

    // Show inputs, hide text
    cells.forEach((cell) => {
      cell.querySelector(".text").style.display = "none";
      cell.querySelector(".edit-input").style.display = "";
    });

    // Store original title & artist for update tracking
    button.dataset.originalTitle = title;
    button.dataset.originalArtist = artist;

    button.textContent = "Save";
  }
}

window.addEventListener("DOMContentLoaded", loadFromLocalStorage);
