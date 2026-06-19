const { Schedule, Venue, Event } = require('../models')
const { hasOverlap } = require('../services/availability.service')

async function getAll(req, res, next) {
  try {
    const where = { is_active: true }
    if (req.query.venue_id) where.venue_id = req.query.venue_id
    if (req.query.event_id) where.event_id = req.query.event_id

    const schedules = await Schedule.findAll({
      where,
      include: [
        { model: Venue, as: 'venue', attributes: ['id', 'name', 'owner_id'] },
        { model: Event, as: 'event', attributes: ['id', 'name', 'price'] }
      ],
      order: [['start_time', 'ASC']]
    })

    res.json({ success: true, data: schedules })
  } catch (error) {
    next(error)
  }
}

async function getOne(req, res, next) {
  try {
    const schedule = await Schedule.findOne({
      where: { id: req.params.id, is_active: true },
      include: [
        { model: Venue, as: 'venue' },
        { model: Event, as: 'event' }
      ]
    })

    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Horario no encontrado' })
    }

    res.json({ success: true, data: schedule })
  } catch (error) {
    next(error)
  }
}

async function create(req, res, next) {
  try {
    const { venue_id, event_id, start_time, end_time, available_slots } = req.body

    const venue = await Venue.findByPk(venue_id)
    if (!venue) {
      return res.status(404).json({ success: false, message: 'Local no encontrado' })
    }

    if (venue.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'No tienes permisos sobre este local' })
    }

    const overlap = await hasOverlap({ venue_id, start_time, end_time })
    if (overlap) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un horario que se solapa con este rango en el mismo local'
      })
    }

    const schedule = await Schedule.create({
      venue_id, event_id, start_time, end_time, available_slots
    })

    res.status(201).json({ success: true, message: 'Horario creado', data: schedule })
  } catch (error) {
    next(error)
  }
}

async function update(req, res, next) {
  try {
    const schedule = await Schedule.findByPk(req.params.id, {
      include: [{ model: Venue, as: 'venue' }]
    })

    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Horario no encontrado' })
    }

    if (schedule.venue.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'No tienes permisos sobre este horario' })
    }

    const { start_time, end_time, available_slots, event_id } = req.body

    const overlap = await hasOverlap({
      venue_id: schedule.venue_id,
      start_time,
      end_time,
      excludeId: schedule.id
    })

    if (overlap) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un horario que se solapa con este rango en el mismo local'
      })
    }

    await schedule.update({ start_time, end_time, available_slots, event_id })

    res.json({ success: true, message: 'Horario actualizado', data: schedule })
  } catch (error) {
    next(error)
  }
}

async function remove(req, res, next) {
  try {
    const schedule = await Schedule.findByPk(req.params.id, {
      include: [{ model: Venue, as: 'venue' }]
    })

    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Horario no encontrado' })
    }

    if (schedule.venue.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'No tienes permisos sobre este horario' })
    }

    await schedule.update({ is_active: false })

    res.json({ success: true, message: 'Horario desactivado' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getOne, create, update, remove }