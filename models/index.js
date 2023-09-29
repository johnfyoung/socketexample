const User = require('./User');
const ChatChannel = require('./ChatChannel');
const Subscription = require('./Subscription');

User.belongsToMany(ChatChannel, { through: 'subscription' });
ChatChannel.belongsToMany(User, { through: 'subscription' });

module.exports = { User, ChatChannel, Subscription };
