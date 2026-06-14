const { validationResult } = require('express-validator')

function validateMiddleware(req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    })
  }

  next()
}

module.exports = validateMiddleware