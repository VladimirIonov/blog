const express = require("express");
const fs = require("fs");
const bodyParser = require('body-parser');

const app = express();
const port = 2000;

app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: true }));

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

response.render("edit-info", note);
});

app.get("/admin/add", (request, response) => {
const note = {};

response.render("edit-info", note);
});

app.post("/admin/edit", (request, response) => {
const editInfo = request.body;
if (!editInfo) response.redirect("/");

editInfo.id = Number(editInfo.id);

const file = fs.readFileSync("./data/notes.json");
const model = JSON.parse(file);
const notes = model.notes.filter(x => x.id == editInfo.id);
let note = {};
if (notes.length > 0) {
note = notes[0];

note.title = editInfo.title;
note.text = editInfo.text;
note.predtext = editInfo.predtext;
} else {
note.id = Math.floor(Math.random()*1000000 + 1);
note.title = editInfo.title;
note.predtext = editInfo.predtext;

model.notes.push(note);
}

const json = JSON.stringify(model);
fs.writeFileSync("./data/notes.json", json);

response.redirect("/");
});

app.get("/*", (request, response) => {
response.redirect("/");
}); 