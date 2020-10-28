const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const auth = require('./middlewares/auth');

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
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to database'));

// config middleware
require('./config/passport')(passport);
app.enable('trust proxy');
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan('dev'));

// Passport init
app.use(
  session({
    secret: 'passport-js',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// route
const api = express.Router();
api.use('/users', usersRouter);
api.use('/boards', auth, boardsRouter);
api.use('/lists', auth, listsRouter);
api.use('/cards', auth, cardsRouter);
app.use('/api/v1', api);

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
