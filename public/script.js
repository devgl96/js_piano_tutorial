// Rules of keys from keyboard
const BLACK_KEYS = ['s', 'd', 'g', 'h', 'j'];
const WHITE_KEYS = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

// Record button
const recordButton = document.querySelector(".record-button");

let recordingStartTime;
let songNotes = currentSong && currentSong.notes;

const playButton = document.querySelector(".play-button");
const saveButton = document.querySelector(".save-button");
const songLink = document.querySelector(".song-link");

// All of the keys
const keys = document.querySelectorAll(".key");
const whiteKeys = document.querySelectorAll(".key.white");
const blackKeys = document.querySelectorAll(".key.black");

const keyMap = [...keys].reduce((map, key) => {
  map[key.dataset.note] = key;

  return map;
}, {});

// Adding the click event in each key
keys.forEach(key => {
  key.addEventListener("click", () => playNote(key));
});

// Adding the event to record button
if (recordButton) {
  recordButton.addEventListener("click", toggleRecording);
}

// Adding the event to save
if (saveButton) {
  saveButton.addEventListener("click", saveSong);
}

// Adding the event to play button
playButton.addEventListener("click", playSong);

function toggleRecording() {
  recordButton.classList.toggle("active");

  if(isRecording()) {
    startRecording();
  } else {
    stopRecording();
  }
}

function isRecording() {
  return recordButton !== null && recordButton.classList.contains("active");
}

function startRecording() {
  recordingStartTime = Date.now();
  songNotes = [];

  playButton.classList.remove("show");
  saveButton.classList.remove("show");
}

function stopRecording() {
  playSong();

  playButton.classList.add("show");
  saveButton.classList.add("show");
}

function playSong() {
  // console.log("SongNotes: ", songNotes);
  if(songNotes.length === 0) return;

  songNotes.forEach(note => {
    setTimeout(() => {
      playNote(keyMap[note.key]);
    }, note.startTime);
  })
}

// console.log(currentSong);

async function saveSong() {
  axios.post("/songs", { songNotes: songNotes }).then(res => {
    songLink.classList.add("show");
    songLink.href = `/songs/${res.data._id}`;
    // console.log(res.data);
  });
}

function recordNote(note) {
  songNotes.push({
    key: note,
    startTime: Date.now() - recordingStartTime
  });
}

// Adding event in each key from keyboard
document.addEventListener("keydown", e => {
  // Without repeat the note
  if(e.repeat) return;

  const key = e.key;
  const whiteKeyIndex = WHITE_KEYS.indexOf(key);
  const blackKeyIndex = BLACK_KEYS.indexOf(key);

  if(whiteKeyIndex > -1) playNote(whiteKeys[whiteKeyIndex]);

  if(blackKeyIndex > -1) playNote(blackKeys[blackKeyIndex]);
});

function playNote(key) {
  if (isRecording()) recordNote(key.dataset.note);
  const noteAudio = document.getElementById(key.dataset.note); // data-note
  noteAudio.currentTime = 0;
  noteAudio.play();
  key.classList.add("active");
  noteAudio.addEventListener("ended", () => {
    key.classList.remove("active");
  });
}