const { Schedule } = require('../models')
const { Op } = require('sequelize')

/**
 * Verifica si existe un horario que se solape con el rango dado,
 * en el mismo local. Dos rangos se solapan si:
 * start_time < end_existing AND end_time > start_existing
 */
async function hasOverlap({ venue_id, start_time, end_time, excludeId = null }) {
  const where = {
    venue_id,
    is_active: true,
    start_time: { [Op.lt]: end_time },
    end_time: { [Op.gt]: start_time }
  }

  if (excludeId) {
    where.id = { [Op.ne]: excludeId }
  }

  const overlapping = await Schedule.findOne({ where })
  return !!overlapping
}

module.exports = { hasOverlap }