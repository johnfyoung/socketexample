const { UUIDV4, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ChatChannel extends Model {
  async getUserCount() {
    return await this.countUsers();
  }
}

ChatChannel.init(
  {
    channel_id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
    },
    channel_name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'chatchannel',
  },
);

module.exports = ChatChannel;
