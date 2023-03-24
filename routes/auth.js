const { Router } = require('express');
const { crearUsuario, login, revalidarToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/valida-jwt');

const router = Router();

router.post('/new', [
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'El email es obligatorio').isEmail(),
  check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
  validarCampos
], crearUsuario);

router.post('/', [
  check('email', 'El email es obligatorio').isEmail(),
  check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
  validarCampos
], login);

router.get('/renew', [
  check('token', 'El token es obligatorio').not().isEmpty(),
], validarJWT, revalidarToken);


module.exports = router;