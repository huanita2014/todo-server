const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Todo = new Schema({
  title: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    required: true,
  },
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'Todo'}
});

module.exports = mongoose.model('Todo', Todo);
