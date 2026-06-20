const router = require('express').Router()
const { getAll, getOne, create, cancel, confirm } = require('../controllers/booking.controller')
const { bookingValidator } = require('../validators/booking.validator')
const validate = require('../middlewares/validate.middleware')
const auth     = require('../middlewares/auth.middleware')

// Todas requieren login
router.get('/',    auth, getAll)
router.get('/:id', auth, getOne)
router.post('/',   auth, bookingValidator, validate, create)
router.patch('/:id/cancel',  auth, cancel)
router.patch('/:id/confirm', auth, confirm)

module.exports = router