const express = require("express");
const cors = require('cors');
var multer = require('multer');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path');
var upload = multer();
const app = express();

app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
/*app.use(express.static(path.join(__dirname, 'notes/build')));*/
app.use(express.static('public'))


app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
  
  
  
  

mongoose.connect("mongodb://localhost:27017/notesApp", {
    useNewUrlParser: true,
});

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    saved: {
        type: String,
        required: true
    }
})

app.get("/hello", (req, res) => {
    res.send("It should work")
})

/*app.get("/", (req, res) => {
    const usersNotes = mongoose.model(`dokugo90@gmail.com`, notesSchema)

    usersNotes.find(function(err, notes) {
        if (err) {
            res.send(err)
        } else {
            res.send(notes)
        }
    })
})*/

app.get("/data", (req, res) => {
    res.send("it works")
})

app.get("/notes", (req, res) => {
    /*const usersNotes = mongoose.model(`dokugo90@gmail.com`, notesSchema)

    usersNotes.find(function(err, notes) {
        if (err) {
            console.log(err)
        } else {
            res.send(notes)
            console.log("sent data")
        }
    })*/
    res.send("Fetch data")
})

app.get("/allNotes/dokugo90@gmail.com", (req, res) => {
    res.status(500).send("Error getting data")
    const usersNotes = mongoose.model(`dokugo90@gmail.com`, notesSchema)

    usersNotes.find(function(err, notes) {
        if (err) {
            console.log(err)
        } else {
            res.json(notes)
            console.log("sent data")
        }
    })
})

app.post("/saveNote/:email/:title/:description", (req, res) => {
    const usersNotes = mongoose.model(`${req.params.email}`, notesSchema)

    let dateTime = new Date();
let hours = dateTime.getHours();
let minutes = dateTime.getMinutes();
let seconds = dateTime.getSeconds();

let amPm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12;
hours = hours ? hours : 12;

minutes = minutes < 10 ? '0'+minutes : minutes;
seconds = seconds < 10 ? '0'+seconds : seconds;

let dateString = `${dateTime.getMonth() + 1}/${dateTime.getDate()}/${dateTime.getFullYear()} at ${hours}:${minutes} ${amPm}`;

    usersNotes.findOneAndUpdate({ title: req.params.title}, { description: req.params.description, saved: dateString}, function(err, success) {
        if (err) {
            console.log(err)
            res.send(err);
        } else {
            console.log("Updated");
            res.redirect("/")
        }
    })
})

app.post("/note/:email", (req, res) => {
    let dateTime = new Date();
let hours = dateTime.getHours();
let minutes = dateTime.getMinutes();
let seconds = dateTime.getSeconds();

let amPm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12;
hours = hours ? hours : 12;

minutes = minutes < 10 ? '0'+minutes : minutes;
seconds = seconds < 10 ? '0'+seconds : seconds;

let dateString = `${dateTime.getMonth() + 1}/${dateTime.getDate()}/${dateTime.getFullYear()} at ${hours}:${minutes} ${amPm}`;
        res.redirect("/")
        const usersNotes = mongoose.model(`${req.params.email}`, notesSchema)
        usersNotes.create({
            title: req.body.title,
            description: req.body.desc,
            saved: dateString
        }, (err, note) => {
            if (err) {
                console.log("Error saving data")
            } else {
                console.log(note)
            }
        })
})

app.post("/deleteNote/:email/:title", (req, res) => {
    const usersNotes = mongoose.model(`${req.params.email}`, notesSchema)
    usersNotes.findOneAndDelete({ title: req.params.title}, function(err, note) {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            res.redirect("/")
        }
    })
})

app.listen(process.env.PORT || 5000);

module.exports = app