const express = require('express');

const router = express.Router();
const { celebrate, Joi } = require('celebrate');
const { regExpUrl, regExpUrlMovies } = require('../utils/consts');

const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      nameEN: Joi.string().required(),
      nameRU: Joi.string().required(),
      country: Joi.string().required(),
      director: Joi.string().required(),
      description: Joi.string().required(),
      year: Joi.string().required(),
      duration: Joi.number().required(),
      movieId: Joi.number().required(),
      // owner: Joi.string().required(),
      image: Joi.string().pattern(regExpUrl).required(),
      trailerLink: Joi.string().pattern(regExpUrlMovies).required(),
      // thumbnail: Joi.string().pattern(linkRegularThumbnail).required(),
      // image: Joi.string().required(),
      // trailerLink: Joi.string().required(),
      thumbnail: Joi.string().required(),
    }),
  }),
  createMovie,
);

router.delete(
  '/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteMovieById,
);

module.exports = router;
