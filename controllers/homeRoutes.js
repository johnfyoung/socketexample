const router = require('express').Router();
const { User, ChatChannel } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    let user = null;
    let channels = [];
    if (req.session.logged_in) {
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
        include: [{ model: ChatChannel }],
      });

      const channelsModels = await ChatChannel.findAll();
      channels = await Promise.all(
        channelsModels.map(async (channel) => {
          const fixed = channel.get({ plain: true });
          fixed.userCount = await channel.getUserCount();
          return fixed;
        }),
      );

      user = userData.get({ plain: true });
    }

    res.render('homepage', {
      user,
      channels,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
    });

    const channelsModels = await ChatChannel.findAll();
    const channels = await Promise.all(
      channelsModels.map(async (channel) => {
        const fixed = channel.get({ plain: true });
        fixed.userCount = await channel.getUserCount();
        return fixed;
      }),
    );

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      channels,
      logged_in: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/signup', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('signup');
});

router.get('/chat/:channel_id', withAuth, async (req, res) => {
  const userModel = await User.findByPk(req.session.user_id, {
    attributes: { exclude: ['password'] },
  });

  const user = userModel.get({ plain: true });

  const channelModel = await ChatChannel.findOne({
    where: {
      channel_id: req.params.channel_id,
    },
    include: [{ model: User }],
  });

  if (channelModel) {
    if (!(await channelModel.hasUser(userModel))) {
      await channelModel.addUser(userModel);
      await channelModel.reload();
    }

    const channel = channelModel.get({ plain: true });

    res.render('chat', {
      ...user,
      channel,
      logged_in: true,
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
