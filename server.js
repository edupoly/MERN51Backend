var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var cors = require("cors");
const TodoModel = require("./model/todos.model");
const QuestionModel = require("./model/question.model");
const userModel = require("./model/user.model");
var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.set("view engine", "pug");

var mongourl =
  "mongodb+srv://edupoly:hello123@cluster0.l8nf5yw.mongodb.net/students?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(mongourl)
  .then(() => {
    console.log("Connect");
  })
  .catch(() => {
    console.log("Not Connected");
  });

app.get("/getAllQuestions", (req, res) => {
  QuestionModel.find(
    {},
    { id: 0, _id: 0, tags: 0, isNiche: 0, difficulty: 0, type: 0, regions: 0 }
  ).then((data) => {
    res.send(data);
  });
});
function checkAuth(req, res, next) {
  try {
    var user = jwt.verify(req.headers.token, "evariki cheppaku");
    console.log("user::", user);
    next();
  } catch (err) {
    // console.log("err::", err);
    res.send({ msg: "sessionTimeout" });
  }
}
app.get("/getAllQuestions/:category", checkAuth, (req, res) => {
  QuestionModel.find(
    { category: req.params.category },
    { _id: 0, tags: 0, isNiche: 0, difficulty: 0, type: 0, regions: 0 }
  ).then((data) => {
    var d = JSON.parse(JSON.stringify(data));
    var questions = d.map((question) => {
      question.options = [...question.incorrectAnswers];
      const randomNumber = Math.floor(Math.random() * 4);
      question.options.splice(randomNumber, 0, question.correctAnswer);
      // delete question.correctAnswer;
      // delete question.incorrectAnswers;
      let { correctAnswer, incorrectAnswers, ...ques } = question;
      return ques;
    });
    // res.render("quiz", { questions: questions });
    res.json(questions);
  });
});

app.post("/submitQuiz", async (req, res) => {
  var data = await QuestionModel.find({ category: req.body.category });
  var count = 0;
  req.body.questions.forEach((q) => {
    if (q.selectedOption) {
      var d = data.find((que) => {
        if (que.id === q.id) {
          if (que.correctAnswer === q.selectedOption) {
            count++;
          }
          q.correctAnswer = que.correctAnswer;
        }
      });
    }
  });
  console.log(req.body);
  console.log(count);
  res.json({
    score: count,
    total: req.body.questions.length,
    updatedQuestions: req.body,
  });
});
app.get("/", (req, res) => {
  res.redirect("/Home.html");
});
app.get("/todos", (req, res) => {
  TodoModel.find({}).then((data) => {
    res.render("todos", { todos: data });
  });
});
app.post("/addTodo", (req, res) => {
  console.log(req.body);

  var newTodo = new TodoModel({
    title: req.body.title,
    status: "pending",
    timestamp: Date.now(),
  });
  newTodo.save();
  console.log(newTodo);
  res.send("AAgu babu");
});
app.post("/registerUser", async (req, res) => {
  console.log(req.body);
  var newUser = userModel(req.body);
  newUser
    .save()
    .then(() => {
      res.send({ msg: "success" });
    })
    .catch((err) => {
      res.send({ msg: JSON.stringify(err) });
    });
});
app.post("/login", async (req, res) => {
  try {
    var data = await userModel.find(req.body);
    console.log("data", data);
    if (data.length != 0) {
      const token = jwt.sign({ user: req.body }, "evariki cheppaku");
      res.send({
        msg: "success",
        token,
        userDetails: { username: req.body.username },
      });
    } else {
      res.send({ msg: "failed" });
    }
  } catch (e) {
    res.send({ msg: "serverError" });
  }
});
app.listen(3500, () => {
  console.log("server running on 3500");
});
