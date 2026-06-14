'use strict'

const { Sequelize } = require('sequelize')
const { sequelize } = require('../config/database')

const User     = require('./User')(sequelize, Sequelize)
const Venue    = require('./Venue')(sequelize, Sequelize)
const Event    = require('./Event')(sequelize, Sequelize)
const Schedule = require('./Schedule')(sequelize, Sequelize)
const Booking  = require('./Booking')(sequelize, Sequelize)
const Payment  = require('./Payment')(sequelize, Sequelize)

// User
User.hasMany(Venue,   { foreignKey: 'owner_id', as: 'venues' })
User.hasMany(Booking, { foreignKey: 'user_id',  as: 'bookings' })

// Venue
Venue.belongsTo(User,       { foreignKey: 'owner_id', as: 'owner' })
Venue.hasMany(Event,        { foreignKey: 'venue_id', as: 'events' })
Venue.hasMany(Schedule,     { foreignKey: 'venue_id', as: 'schedules' })

// Event
Event.belongsTo(Venue,      { foreignKey: 'venue_id', as: 'venue' })
Event.hasMany(Schedule,     { foreignKey: 'event_id', as: 'schedules' })

// Schedule
Schedule.belongsTo(Venue,   { foreignKey: 'venue_id', as: 'venue' })
Schedule.belongsTo(Event,   { foreignKey: 'event_id', as: 'event' })
Schedule.hasMany(Booking,   { foreignKey: 'schedule_id', as: 'bookings' })

// Booking
Booking.belongsTo(User,     { foreignKey: 'user_id',     as: 'user' })
Booking.belongsTo(Schedule, { foreignKey: 'schedule_id', as: 'schedule' })
Booking.hasOne(Payment,     { foreignKey: 'booking_id',  as: 'payment' })

// Payment
Payment.belongsTo(Booking,  { foreignKey: 'booking_id', as: 'booking' })

module.exports = { sequelize, Sequelize, User, Venue, Event, Schedule, Booking, Payment }