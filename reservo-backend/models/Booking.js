'use strict'

module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    schedule_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    guests: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'expired'),
      allowNull: false,
      defaultValue: 'pending'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'bookings',
    underscored: true
  })

  return Booking
}