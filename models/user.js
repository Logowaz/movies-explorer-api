const mongoose = require('mongoose');
const validator = require('validator');

// const { regExpUrl } = require('../utils/consts');

const userSchema = new mongoose.Schema({
  name: {
    required: [true, 'Поле "email" должно быть заполнено'],
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },

  email: {
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
    type: String,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Введите корректный E-mail',
    },
  },

  password: {
    required: [true, 'Поле "password" должно быть заполнено'],
    type: String,
    select: false,
  },
});

userSchema.methods.toJSON = function toJSON() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('user', userSchema);
