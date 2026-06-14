'use strict'

module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    venue_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    event_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    available_slots: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'schedules',
    underscored: true
  })

  return Schedule
}