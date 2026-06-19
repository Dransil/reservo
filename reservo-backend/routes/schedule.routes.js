const router = require('express').Router()
const { getAll, getOne, create, update, remove } = require('../controllers/schedule.controller')
const { scheduleValidator } = require('../validators/schedule.validator')
const validate = require('../middlewares/validate.middleware')
const auth     = require('../middlewares/auth.middleware')
const role     = require('../middlewares/role.middleware')

// Públicas
router.get('/',    getAll)
router.get('/:id', getOne)

// Protegidas
router.post('/',    auth, role('owner', 'admin'), scheduleValidator, validate, create)
router.put('/:id',  auth, role('owner', 'admin'), scheduleValidator, validate, update)
router.delete('/:id', auth, role('owner', 'admin'), remove)

module.exports = router