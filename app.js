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
app.get("/*", (request, response) => {
response.redirect("/");
});