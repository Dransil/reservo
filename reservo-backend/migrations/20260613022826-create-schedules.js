'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('schedules', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      venue_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'venues', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      event_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'events', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      available_slots: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    await queryInterface.dropTable('schedules')
  }
}