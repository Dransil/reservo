'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      schedule_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'schedules', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      guests: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'cancelled', 'expired'),
        allowNull: false,
        defaultValue: 'pending'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_bookings_status";')
    await queryInterface.dropTable('bookings')
  }
}