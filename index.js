const express = require("express");
const bodyParser = require("body-parser");
// const { Server } = require("http");
const ejs = require("ejs");
const mongoose = require("mongoose");
const multer = require("multer");

const ImageModel = require("./image-modal");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");

//////  MONGODB CONNECTION
mongoose
  .connect(
    "mongodb+srv://findmygift:findmygift@cluster0.srk4rei.mongodb.net/?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(() => console.log("Connected to the DB"))
  .catch((error) => console.log("Error Msg " + error));

// Multer Storage
const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: Storage,
}).single("testImage");

app.get("/", function (req, res) {
  // res.render("index");
  res.send("File Upload");
});

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) console.log("Error in upload" + err);
    else {
      const newImage = new ImageModel({
        name: req.body.name,
        image: {
          data: req.file.filename,
          contentType: "image/png",
        },
      });
      newImage
        .save()
        .then(() => res.send("Image uploaded Successfully"))
        .catch((err) => console.log("Error in Saving image " + err));
    }
  });
});

// app.post("/submit", function (req, res) {
//   // res.render("submit");
// });

app.listen(port, () =>
  console.log(`Example app listening on port 
${port}!`)
);
