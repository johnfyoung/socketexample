const { UUIDV4, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Subscription extends Model {}

Subscription.init(
  {
    subscription_id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'subscription',
  },
);

module.exports = Subscription;
