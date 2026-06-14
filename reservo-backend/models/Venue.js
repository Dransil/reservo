'use strict'

module.exports = (sequelize, DataTypes) => {
  const Venue = sequelize.define('Venue', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'venues',
    underscored: true
  })

  return Venue
}