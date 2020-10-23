const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalHandler = require('./controllers/errorsController');
require('dotenv').config();

const usersRouter = require('./routes/users');
const boardsRouter = require('./routes/boards');
const listsRouter = require('./routes/lists');
const cardsRouter = require('./routes/cards');

//Connect database
mongoose.connect(process.env.DB_URI_LOCAL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to database'));

// config
app.enable('trust proxy');
app.use(cors());

// middleware
app.use(express.json());
app.use(morgan('dev'));

// route
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/boards', boardsRouter);
app.use('/api/v1/lists', listsRouter);
app.use('/api/v1/cards', cardsRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.method} - ${req.originalUrl} on this server!`,
      404
    )
  );
});
app.use(globalHandler);
//Setup
const port = process.env.PORT || '3000';
app.listen(port, () => console.log(`server started in port ${port}`));
