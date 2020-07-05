const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRouter = require('./routes/todo.routes');
const userRouter = require('./routes/user.routes');
const config = require('config');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use('/api/todos', todoRouter);
app.use('/api/users', userRouter);

const PORT = config.get('port') || 4000;

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    const connection = mongoose.connection;
  } catch (err) {
    console.log('Server error', err.message);
    process.exit(1);
  }
}

start();
