var mongoose = require("mongoose");

var todoSchema = new mongoose.Schema({
  title: String,
  status: String,
  timestamp: Array,
});

var TodoModel = mongoose.model("todo", todoSchema);
module.exports = TodoModel;
