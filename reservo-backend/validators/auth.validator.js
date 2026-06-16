const { body } = require('express-validator')

const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2 }).withMessage('Mínimo 2 caracteres'),

  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido'),

  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),

  body('phone')
    .optional()
    .isMobilePhone().withMessage('Teléfono inválido')
]

const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido'),

  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
]

module.exports = { registerValidator, loginValidator }