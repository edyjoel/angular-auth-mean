const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

  const { name, email, password } = req.body;

  try {

    const usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        message: 'Un usuario existe con ese correo',
      });
    }

    const dbUser = new Usuario(req.body);

    const salt = bcrypt.genSaltSync();
    dbUser.password = bcrypt.hashSync(password, salt);

    const token = await generarJWT(dbUser.id, name);

    await dbUser.save();

    return res.status(201).json({
      ok: true,
      uid: dbUser.id,
      name,
      token,
      message: 'Usuario creado',
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: 'Hable con el administrador',
    });
  }

}

const login = async (req, res) => {

  const { email, password } = req.body;

  try {

    const dbUser = await Usuario.findOne({ email });

    if (!dbUser) {
      return res.status(400).json({
        ok: false,
        message: 'El usuario no existe con ese email',
      });
    }

    const validPassword = bcrypt.compareSync(password, dbUser.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        message: 'Password incorrecto',
      });
    }

    const token = await generarJWT(dbUser.id, dbUser.name);

    return res.status(200).json({
      ok: true,
      uid: dbUser.id,
      name: dbUser.name,
      token,
      message: 'Login correcto',
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Hable con el administrador',
    });
  }

}

const revalidarToken = async (req, res) => {

  const { uid, name } = req;

  const token = await generarJWT(uid, name);

  return res.status(200).json({
    ok: true,
    message: 'Renew',
    token,
    name,
    uid,
  });
}

module.exports = {
  crearUsuario,
  login,
  revalidarToken,
};