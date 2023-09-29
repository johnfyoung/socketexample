const sequelize = require('../config/connection');
const { User, ChatChannel } = require('../models');

const userData = require('./userData.json');
const channelsData = require('./channelsData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  await ChatChannel.bulkCreate(channelsData, {
    individualHooks: true,
    returning: true,
  });

  process.exit(0);
};

seedDatabase();
