const router = require('express').Router()
const { getAll, getOne, create, update, remove } = require('../controllers/event.controller')
const { eventValidator } = require('../validators/event.validator')
const validate = require('../middlewares/validate.middleware')
const auth     = require('../middlewares/auth.middleware')
const role     = require('../middlewares/role.middleware')
const upload   = require('../middlewares/upload.middleware')

// Públicas
router.get('/',    getAll)
router.get('/:id', getOne)

// Protegidas
router.post('/',    auth, role('owner', 'admin'), upload.single('image'), eventValidator, validate, create)
router.put('/:id',  auth, role('owner', 'admin'), upload.single('image'), eventValidator, validate, update)
router.delete('/:id', auth, role('owner', 'admin'), remove)

module.exports = router