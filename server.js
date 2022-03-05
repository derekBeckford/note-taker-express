const PORT = process.env.PORT || 3001;
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./db/db.json"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  const noteList = JSON.parse(fs.readFileSync("./db/db.json"));
  newNote.id = uniqid();
  noteList.push(newNote);
  fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
  res.json(noteList);
});

app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  let noteList = JSON.parse(fs.readFileSync("./db/db.json"));
  noteList = noteList.filter((x) => x.id !== noteId);
  fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
  res.json(noteList);
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
