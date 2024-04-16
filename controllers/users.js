const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET, NODE_ENV } = require('../utils/config');

const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');
const UnauthorizedError = require('../errors/unauthorizedError');
const ValidationError = require('../errors/validationError');
const DefaultError = require('../errors/defaultError');

const statusOK = 201;

const createUser = (req, res, next) => {
  bcrypt.hash(String(req.body.password), 10)
    .then((hashedpassword) => User.create({ ...req.body, password: hashedpassword }))
    .then((user) => res.status(statusOK).send({ data: user.toJSON() }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некоректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким E-mail уже существует'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(() => new UnauthorizedError('Пользователь не найден'))
    .then((user) => {
      // console.log(user);
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret_key', { expiresIn: '10d' });
            // const jwt = jsonWebToken.sign({ _id: user._id }, 'secret_key', { expiresIn: '10d' });
            // res.cookie('jwt', jwt, {
            //   maxAge: 2629440000,
            //   httpOnly: true,
            //   sameSite: true,
            // });
            res.status(200).send({ token: jwt });
            // res.send({ data: user });
          } else {
            throw new UnauthorizedError('Некорректный логин или пароль');
          }
        });
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  const owner = req.user._id;
  // console.log(req.user._id);
  User.findByIdAndUpdate(owner, { name, email }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким E-mail уже существует'));
      } else next(new DefaultError('Произошла неизвестная ошибка'));
    });
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден');
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

module.exports = {
  createUser,
  updateProfile,
  login,
  getUserInfo,
};
