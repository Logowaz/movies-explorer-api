const express = require('express');

const router = express.Router();
const { celebrate, Joi } = require('celebrate');
const NotFoundError = require('../errors/notFoundError');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const userRoutes = require('./users');
const movieRoutes = require('./movies');
// const { regExpUrl } = require('../utils/consts');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().required(),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

router.use(auth);
router.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Указанный путь не существует'));
});

module.exports = router;
