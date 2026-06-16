const router = require('express').Router()
const { register, login, me } = require('../controllers/auth.controller')
const { registerValidator, loginValidator } = require('../validators/auth.validator')
const validate = require('../middlewares/validate.middleware')
const auth = require('../middlewares/auth.middleware')

router.post('/register', registerValidator, validate, register)
router.post('/login', loginValidator, validate, login)
router.get('/me', auth, me)

module.exports = router