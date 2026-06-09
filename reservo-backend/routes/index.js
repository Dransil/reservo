const router = require('express').Router()

router.use('/auth', require('./auth.routes'))
router.use('/venues', require('./venue.routes'))
router.use('/events', require('./event.routes'))
router.use('/bookings', require('./booking.routes'))
router.use('/payments', require('./payment.routes'))
router.use('/users', require('./user.routes'))

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() })
})

module.exports = router