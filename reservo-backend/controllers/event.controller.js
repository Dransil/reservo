const { Event, Venue } = require('../models')

async function getAll(req, res, next) {
  try {
    const where = { is_active: true }
    if (req.query.venue_id) where.venue_id = req.query.venue_id

    const events = await Event.findAll({
      where,
      include: [{ model: Venue, as: 'venue', attributes: ['id', 'name', 'owner_id'] }],
      order: [['created_at', 'DESC']]
    })

    res.json({ success: true, data: events })
  } catch (error) {
    next(error)
  }
}

async function getOne(req, res, next) {
  try {
    const event = await Event.findOne({
      where: { id: req.params.id, is_active: true },
      include: [{ model: Venue, as: 'venue', attributes: ['id', 'name', 'owner_id'] }]
    })

    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' })
    }

    res.json({ success: true, data: event })
  } catch (error) {
    next(error)
  }
}

async function create(req, res, next) {
  try {
    const { name, description, price, capacity, venue_id } = req.body

    // Verifica que el local pertenezca al usuario (o sea admin)
    const venue = await Venue.findByPk(venue_id)
    if (!venue) {
      return res.status(404).json({ success: false, message: 'Local no encontrado' })
    }

    if (venue.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'No tienes permisos sobre este local' })
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : null

    const event = await Event.create({
      name, description, price, capacity, venue_id, image_url
    })

    res.status(201).json({ success: true, message: 'Evento creado', data: event })
  } catch (error) {
    next(error)
  }
}

async function update(req, res, next) {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{ model: Venue, as: 'venue' }]
    })

    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' })
    }

    if (event.venue.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'No tienes permisos sobre este evento' })
    }

    const { name, description, price, capacity } = req.body
    const image_url = req.file ? `/uploads/${req.file.filename}` : event.image_url

    await event.update({ name, description, price, capacity, image_url })

    res.json({ success: true, message: 'Evento actualizado', data: event })
  } catch (error) {
    next(error)
  }
}

async function remove(req, res, next) {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{ model: Venue, as: 'venue' }]
    })

    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' })
    }

    if (event.venue.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'No tienes permisos sobre este evento' })
    }

    await event.update({ is_active: false })

    res.json({ success: true, message: 'Evento desactivado' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getOne, create, update, remove }