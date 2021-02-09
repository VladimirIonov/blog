const express = require("express");
const fs = require("fs");

const app = express();
const port = 2000;

app.set("view engine", "hbs");

app.listen(port, () => {
console.log(`App is running on http://localhost:${port}/`);
});

app.get("/", (request, response) => {
const file = fs.readFileSync("./data/notes.json");

const model = JSON.parse(file);
response.render("index", model);
});

app.get("/info/:id", (request, response) => {
const id = request.params.id;
const file = fs.readFileSync("./data/notes.json");
const model = JSON.parse(file);
const notes = model.notes.filter(x => x.id == id);

if (notes.length < 1) response.redirect("/");

response.render("info", notes[0]);
});

app.get("/admin/edit/:id", (request, response) => {
const id = request.params.id;
const file = fs.readFileSync("./data/notes.json");
const model = JSON.parse(file);
const notes = model.notes.filter(x => x.id == id);

let note = {};
if (notes.length > 0) note = notes[0];

response.render("info", note);
});

app.post("/admin/edit", (request, response) => {
const editInfo = request.body;
if (!editInfo) response.redirect("/");

const file = fs.readFileSync("./data/notes.json");
const model = JSON.parse(file);
const notes = model.notes.filter(x => x.id == id);

if (notes.length < 1) {
const note = notes[0];

note.title = editInfo.title;
note.text = editInfo.text;
} else {
note.id = notes[notes.length - 1].id + 1;
notes.push(note);
}

response.redirect("/");
});

app.get("/*", (request, response) => {
response.redirect("/");
});