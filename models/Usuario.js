const { Schema, model } = require('mongoose');

const UsuarioSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // data: {
  //   type: Date,
  //   default: Date.now,
  // },
});

module.exports = model('Usuario', UsuarioSchema);