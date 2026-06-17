const router = require('express').Router()
const { getAll, getOne, create, update, remove } = require('../controllers/venue.controller')
const { venueValidator } = require('../validators/venue.validator')
const validate  = require('../middlewares/validate.middleware')
const auth      = require('../middlewares/auth.middleware')
const role      = require('../middlewares/role.middleware')
const upload    = require('../middlewares/upload.middleware')

// Públicas
router.get('/',    getAll)
router.get('/:id', getOne)

// Protegidas — solo owner y admin pueden crear/editar/borrar
router.post('/',    auth, role('owner', 'admin'), upload.single('image'), venueValidator, validate, create)
router.put('/:id',  auth, role('owner', 'admin'), upload.single('image'), venueValidator, validate, update)
router.delete('/:id', auth, role('owner', 'admin'), remove)

module.exports = router