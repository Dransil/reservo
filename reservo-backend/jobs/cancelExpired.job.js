const cron = require('node-cron')
const { Op } = require('sequelize')
const { Booking } = require('../models')
const { cancelBooking } = require('../services/booking.service')

/**
 * Corre cada minuto. Busca bookings 'pending' cuyo expires_at ya pasó
 * y las cancela, restaurando el cupo del schedule.
 */
function startCancelExpiredJob() {
  cron.schedule('* * * * *', async () => {
    try {
      const expiredBookings = await Booking.findAll({
        where: {
          status: 'pending',
          expires_at: { [Op.lte]: new Date() }
        }
      })

      if (expiredBookings.length === 0) return

      for (const booking of expiredBookings) {
        await cancelBooking(booking)
        await booking.update({ status: 'expired' })
      }

      console.log(`[cron] ${expiredBookings.length} reserva(s) expirada(s) canceladas`)
    } catch (error) {
      console.error('[cron] Error cancelando reservas expiradas:', error)
    }
  })

  console.log('[cron] Job cancelExpired iniciado')
}

module.exports = startCancelExpiredJob