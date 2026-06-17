const { body } = require('express-validator')

const venueValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2 }).withMessage('Mínimo 2 caracteres'),

  body('capacity')
    .notEmpty().withMessage('La capacidad es requerida')
    .isInt({ min: 1 }).withMessage('La capacidad debe ser un número mayor a 0'),

  body('description')
    .optional()
    .trim(),

  body('address')
    .optional()
    .trim()
]

module.exports = { venueValidator }