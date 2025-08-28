var mongoose = require("mongoose");

var questionSchema = new mongoose.Schema({
  category: String,
  id: String,
  correctAnswer: String,
  incorrectAnswers: Array,
  question: Object,
  tags: Array,
  type: String,
  difficulty: String,
  regions: Array,
  isNiche: Boolean,
});

var QuestionModel = mongoose.model("question", questionSchema);
module.exports = QuestionModel;

// {
//     "category": "science",
//     "id": "64f3a941601ffca0b7615ddb",
//     "correctAnswer": "Read Only Memory",
//     "incorrectAnswers": [
//       "Random Object Medium",
//       "Real Orchestration Mode",
//       "Rare Ownership Modifications"
//     ],
//     "question": {
//       "text": "What does the acronym 'ROM' stand for in computers?"
//     },
//     "tags": [
//       "computing",
//       "technology",
//       "acronyms",
//       "initials",
//       "science"
//     ],
//     "type": "text_choice",
//     "difficulty": "medium",
//     "regions": [],
//     "isNiche": false
