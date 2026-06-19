const { body } = require('express-validator')

const scheduleValidator = [
  body('venue_id')
    .notEmpty().withMessage('El local es requerido')
    .isUUID().withMessage('ID de local inválido'),

  body('event_id')
    .optional({ nullable: true })
    .isUUID().withMessage('ID de evento inválido'),

  body('start_time')
    .notEmpty().withMessage('La hora de inicio es requerida')
    .isISO8601().withMessage('Formato de fecha inválido'),

  body('end_time')
    .notEmpty().withMessage('La hora de fin es requerida')
    .isISO8601().withMessage('Formato de fecha inválido')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.start_time)) {
        throw new Error('end_time debe ser posterior a start_time')
      }
      return true
    }),

  body('available_slots')
    .notEmpty().withMessage('El cupo disponible es requerido')
    .isInt({ min: 1 }).withMessage('Debe ser un número mayor a 0')
]

module.exports = { scheduleValidator }