const { sequelize, Schedule, Booking } = require('../models')

const BOOKING_EXPIRATION_MINUTES = 30

/**
 * Crea una reserva de forma atómica:
 * 1. Bloquea la fila del schedule (FOR UPDATE)
 * 2. Verifica que haya cupo
 * 3. Decrementa available_slots
 * 4. Crea el booking con expires_at
 */
async function createBooking({ user_id, schedule_id, guests, notes }) {
  return sequelize.transaction(async (t) => {
    const schedule = await Schedule.findOne({
      where: { id: schedule_id, is_active: true },
      lock: t.LOCK.UPDATE,
      transaction: t
    })

    if (!schedule) {
      const error = new Error('Horario no encontrado')
      error.status = 404
      throw error
    }

    if (schedule.available_slots < guests) {
      const error = new Error('No hay suficiente cupo disponible')
      error.status = 409
      throw error
    }

    if (new Date(schedule.start_time) <= new Date()) {
      const error = new Error('Este horario ya pasó o está en curso')
      error.status = 409
      throw error
    }

    await schedule.decrement('available_slots', { by: guests, transaction: t })

    const expires_at = new Date(Date.now() + BOOKING_EXPIRATION_MINUTES * 60 * 1000)

    const booking = await Booking.create({
      user_id,
      schedule_id,
      guests,
      notes,
      status: 'pending',
      expires_at
    }, { transaction: t })

    return booking
  })
}

/**
 * Cancela una reserva y restaura el cupo
 */
async function cancelBooking(booking) {
  return sequelize.transaction(async (t) => {
    const schedule = await Schedule.findByPk(booking.schedule_id, {
      lock: t.LOCK.UPDATE,
      transaction: t
    })

    if (schedule) {
      await schedule.increment('available_slots', { by: booking.guests, transaction: t })
    }

    await booking.update({ status: 'cancelled' }, { transaction: t })

    return booking
  })
}

module.exports = { createBooking, cancelBooking }