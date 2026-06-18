const { body } = require('express-validator')

const eventValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2 }).withMessage('Mínimo 2 caracteres'),

  body('venue_id')
    .notEmpty().withMessage('El local es requerido')
    .isUUID().withMessage('ID de local inválido'),

  body('price')
    .notEmpty().withMessage('El precio es requerido')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor o igual a 0'),

  body('capacity')
    .notEmpty().withMessage('La capacidad es requerida')
    .isInt({ min: 1 }).withMessage('La capacidad debe ser un número mayor a 0'),

  body('description')
    .optional()
    .trim()
]

module.exports = { eventValidator }