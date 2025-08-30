var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
const multer = require("multer");
app.use(cors());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.post("/addProfile", upload.single("profilePic"), async (req, res) => {
  console.log("req.body::", req.body);
  console.log("filuuu", req.file);
  res.send("Aagu ra babu");
});

app.listen(3400, () => {
  console.log("server running on 3400");
});
