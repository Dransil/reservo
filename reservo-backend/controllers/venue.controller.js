const { Venue, User } = require('../models')

async function getAll(req, res, next) {
  try {
    const venues = await Venue.findAll({
      where: { is_active: true },
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }],
      order: [['created_at', 'DESC']]
    })

    res.json({ success: true, data: venues })
  } catch (error) {
    next(error)
  }
}

async function getOne(req, res, next) {
  try {
    const venue = await Venue.findOne({
      where: { id: req.params.id, is_active: true },
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }]
    })

    if (!venue) {
      return res.status(404).json({ success: false, message: 'Local no encontrado' })
    }

    res.json({ success: true, data: venue })
  } catch (error) {
    next(error)
  }
}

async function create(req, res, next) {
  try {
    const { name, description, address, capacity } = req.body

    const image_url = req.file ? `/uploads/${req.file.filename}` : null

    const venue = await Venue.create({
      name,
      description,
      address,
      capacity,
      image_url,
      owner_id: req.user.id
    })

    res.status(201).json({ success: true, message: 'Local creado', data: venue })
  } catch (error) {
    next(error)
  }
}

async function update(req, res, next) {
  try {
    const venue = await Venue.findOne({
      where: { id: req.params.id, owner_id: req.user.id }
    })

    if (!venue) {
      return res.status(404).json({ success: false, message: 'Local no encontrado' })
    }

    const { name, description, address, capacity } = req.body
    const image_url = req.file ? `/uploads/${req.file.filename}` : venue.image_url

    await venue.update({ name, description, address, capacity, image_url })

    res.json({ success: true, message: 'Local actualizado', data: venue })
  } catch (error) {
    next(error)
  }
}

async function remove(req, res, next) {
  try {
    const venue = await Venue.findOne({
      where: { id: req.params.id, owner_id: req.user.id }
    })

    if (!venue) {
      return res.status(404).json({ success: false, message: 'Local no encontrado' })
    }

    await venue.update({ is_active: false })

    res.json({ success: true, message: 'Local desactivado' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getOne, create, update, remove }