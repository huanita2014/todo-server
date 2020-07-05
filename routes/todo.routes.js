const { Router } = require('express');
const router = Router();
const Todo = require('../Models/Todo.model');
const User = require('../Models/User.model');
const passport = require('passport');

//get all user's todos
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById({ _id: req.user._id }).populate('todos').exec((err, document) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(document.todos);
    }
  });
});

//get todo by id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    data = await Todo.findById(id);
    res.json(data);
  } catch (err) {
    res.status(500).send(`Error: ${err}`);
  }
});

router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
  const todo = new Todo({...req.body, owner: req.user._id});
  todo.save(err => {
    if (err) {
      res.status(500).json({ message: "error asd" });
    } else {
      req.user.todos.push(todo);
      req.user.save(err => {
        if (err) {
          res.status(500).json({ message: err });
          console.log(err)
        } else {
          res.status(200).json({ message: `Todo ${todo.title} added successfully`, todo: todo });
        }
      });
    }
  });
});

//update todo by id
router.put('/update/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Todo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      if (err) {
        res.status(500).send(`Error: ${err}`);
      } else {
        res
          .status(200)
          .json({ todo: todo, message: 'Todo updated successfully' });
      }
    }
  );
});

//toggle todos checked status
router.put('/',  passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const todos = await Todo.find({ done: false, owner: req.user._id }, async (err) => { });
    Todo.updateMany(
      { owner: req.user },
      { done: todos.length > 0 ? true : false },
      (err, data) => {
        if (err) {
          res.status(500).send(`Error: ${err}`);
        } else {
          res.status(200).json('Todos updated successfully');
        }
      }
    );
  } catch (err) {
    res.status(500).send(`Error: ${err}`);
  }
});

//delete todo by id
router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const data = await Todo.findByIdAndRemove(req.params.id);
  try {
    if (!data) {
      res.status(404).send('todo is not found');
    } else {
      res.send('Todo was deleted successfully');
    }
  } catch (err) {
    res.status(500).send(`Error: ${err}`);
  }
});

//delete all checked todos
router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const data = await Todo.deleteMany({ done: true, owner: req.user });
    res.send(`${data.deletedCount} todos was deleted successfully`);
  } catch (err) {
    res.status(500).send(`Error: ${err}`);
  }
});

module.exports = router;
