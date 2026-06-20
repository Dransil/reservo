const { Booking, Schedule, Venue, Event, User } = require('../models')
const { createBooking, cancelBooking } = require('../services/booking.service')

async function getAll(req, res, next) {
  try {
    const where = {}

    // Clientes solo ven sus propias reservas
    if (req.user.role === 'client') {
      where.user_id = req.user.id
    }

    const bookings = await Booking.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        {
          model: Schedule,
          as: 'schedule',
          include: [
            { model: Venue, as: 'venue', attributes: ['id', 'name', 'owner_id'] },
            { model: Event, as: 'event', attributes: ['id', 'name', 'price'] }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    })

    res.json({ success: true, data: bookings })
  } catch (error) {
    next(error)
  }
}

async function getOne(req, res, next) {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        {
          model: Schedule,
          as: 'schedule',
          include: [
            { model: Venue, as: 'venue' },
            { model: Event, as: 'event' }
          ]
        }
      ]
    })

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Reserva no encontrada' })
    }

    const isOwnerOfVenue = booking.schedule.venue.owner_id === req.user.id
    const isOwnBooking = booking.user_id === req.user.id

    if (!isOwnBooking && !isOwnerOfVenue && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'No tienes acceso a esta reserva' })
    }

    res.json({ success: true, data: booking })
  } catch (error) {
    next(error)
  }
}

async function create(req, res, next) {
  try {
    const { schedule_id, guests, notes } = req.body

    const booking = await createBooking({
      user_id: req.user.id,
      schedule_id,
      guests,
      notes
    })

    res.status(201).json({ success: true, message: 'Reserva creada, pendiente de pago', data: booking })
  } catch (error) {
    next(error)
  }
}

async function cancel(req, res, next) {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Schedule, as: 'schedule', include: [{ model: Venue, as: 'venue' }] }]
    })

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Reserva no encontrada' })
    }

    const isOwnerOfVenue = booking.schedule.venue.owner_id === req.user.id
    const isOwnBooking = booking.user_id === req.user.id

    if (!isOwnBooking && !isOwnerOfVenue && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'No tienes acceso a esta reserva' })
    }

    if (booking.status === 'cancelled') {
      return res.status(409).json({ success: false, message: 'La reserva ya está cancelada' })
    }

    await cancelBooking(booking)

    res.json({ success: true, message: 'Reserva cancelada' })
  } catch (error) {
    next(error)
  }
}

async function confirm(req, res, next) {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Schedule, as: 'schedule', include: [{ model: Venue, as: 'venue' }] }]
    })

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Reserva no encontrada' })
    }

    const isOwnerOfVenue = booking.schedule.venue.owner_id === req.user.id

    if (!isOwnerOfVenue && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Solo el dueño del local puede confirmar' })
    }

    if (booking.status !== 'pending') {
      return res.status(409).json({ success: false, message: 'Solo se pueden confirmar reservas pendientes' })
    }

    await booking.update({ status: 'confirmed', expires_at: null })

    res.json({ success: true, message: 'Reserva confirmada', data: booking })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getOne, create, cancel, confirm }