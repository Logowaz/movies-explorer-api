require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const cookieParser = require('cookie-parser');
const cors = require('cors');
// const bodyParser = require('body-parser');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT, MONGO_DB } = require('./utils/config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_DB);

app.use(requestLogger);

// app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://localhost:3000', 'https://localhost:3001', 'http://localhost:5173', 'https://localhost:5173', 'https://logowaz25.nomoredomainsmonster.ru', 'http://logowaz25.nomoredomainsmonster.ru',
    'http://logowaz25back.nomoredomainsmonster.ru', 'https://logowaz25back.nomoredomainsmonster.ru'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
}));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

const router = require('./routes');

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
