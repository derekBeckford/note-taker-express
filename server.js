const PORT = process.env.PORT || 3001;
const fs = require("fs");
const path = require("path");

const express = require("express");
const { ESRCH } = require("constants");
const app = express();
const savedNotes = require("./db/db.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/api/notes", (req, res) => {
  return res.json(savedNotes.slice(1));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

function makeNewNote(body, notesArray) {
  const newNote = body;
  if (!Array.isArray(notesArray)) {
    notesArray = [];
  }
  if (notesArray.length === 0) {
    notesArray.push(0);
  }
  body.id = notesArray[0];
  notesArray.push(newNote);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(notesArray, null, 2)
  );
  return newNote;
}

app.post("/api/notes", (req, res) => {
  const newNote = makeNewNote(req.body, savedNotes);
  res.json(newNote);
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
