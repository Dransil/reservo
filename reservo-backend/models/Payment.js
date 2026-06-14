'use strict'

module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    booking_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'refunded', 'failed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    method: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'payments',
    underscored: true
  })

  return Payment
}