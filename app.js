const express = require("express");
const fs = require("fs");
const bodyParser = require('body-parser');
const { request } = require("express");

const app = express();
const port = 2000;
const auth = {
    login: "admin",
    pass:"1234"
}
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/admin",(request, response, next) => {
    const user = request.query;
    
    if (!user || user.login != auth.login || user.pass != auth.pass) {
    response.header({"Content-Type": "text/html; charset=utf-8"});
    response.status(401);
    response.send("Ошибка авторизации!");
    }
    next();
    });

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
const user = request.query;


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
app.get("/admin/delete/:id", (request, response) => {
    let id = request.params.id;

    if (!id) response.redirect("/");
    id = Number(id);
    
    const file = fs.readFileSync("./data/notes.json");
    const model = JSON.parse(file);
    model.notes = model.notes.filter(x => x.id != id);
    
    const json = JSON.stringify(model);
    fs.writeFileSync("./data/notes.json", json);
    
    response.redirect("/");
    });
    
    app.get("/*", (request, response) => {
    response.redirect("/");
    });