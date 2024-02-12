const Movie = require('../models/movie');

const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const ValidationError = require('../errors/validationError');

const statusOK = 201;

// Обработчик получения всех карточек
const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

// Обработчик удаления карточки по идентификатору
const deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.cardId)
    .orFail(() => new NotFoundError('Карточка кинофильма с указанным id не найдена'))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        Movie.deleteOne(movie)
          .then(() => res.send({ data: movie }))
          .catch(next);
      } else {
        throw new ForbiddenError('Попытка удалить чужую карточку');
      }
    })
    .catch(next);
};

// Обработчик создания карточки фильма
const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    owner,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(statusOK).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovieById,
};
