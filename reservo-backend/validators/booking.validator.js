const { body } = require('express-validator')

const bookingValidator = [
  body('schedule_id')
    .notEmpty().withMessage('El horario es requerido')
    .isUUID().withMessage('ID de horario inválido'),

  body('guests')
    .notEmpty().withMessage('El número de personas es requerido')
    .isInt({ min: 1 }).withMessage('Debe ser un número mayor a 0'),

  body('notes')
    .optional()
    .trim()
]

module.exports = { bookingValidator }