const express = require('express');
const router = express.Router({ mergeParams: true });

const { User } = require('../models/users');
const { Order } = require('../models/orders');
const { Area } = require('../models/areas');

const { isLoggedIn, isActiveUser, isAdminUser, isSelfUser, isAdminOrNodelUser } = require('../middleware/auth');

// USER PROFILE
router.get('/dashboard', [isLoggedIn, isActiveUser], async (req, res) => {
  res.render('./users/dashboard');
});

router.get('/', [isLoggedIn, isActiveUser, isAdminOrNodelUser], async (req, res) => {
  const query = req.query || {};

  users = await User.find(query);
  res.render('./users/index', { users });
});

router.get('/:id/edit', [isLoggedIn, isActiveUser, isSelfUser], async (req, res) => {
  await User.findById(req.params.id, async (err, found) => {
    if (err || !found) {
      console.log(err);
      req.flash('error', 'User not found');
      res.redirect('back');
    } else {
      let roles = [];
      const area = await Area.findOne({ name: req.user.area });
      if (area) roles = area.role;
      res.render('users/edit', { user: found, roles, areas: [req.user.area] });
    }
  });
});

router.put('/:id', [isLoggedIn, isActiveUser, isSelfUser], async (req, res) => {
  if (req.user.role === 'ADMIN' && req.body.isActive) {
    req.body.isActive = true;
  } else if (req.user.role === 'ADMIN') {
    req.body.isActive = false;
  }

  await User.findByIdAndUpdate(req.params.id, req.body, (err, update) => {
    if (err || !update) {
      console.log(err);
      req.flash('error', `Can not update please try again`);
      res.redirect('back');
    } else {
      req.flash('primary', `User ${update.username} Updated`);
      res.redirect('/users/dashboard');
    }
  });
});

router.delete('/:id', [isLoggedIn, isActiveUser, isAdminUser], async (req, res) => {
  await User.findByIdAndRemove(req.params.id, (err, removed) => {
    if (err) {
      console.log(err);
      req.flash('error', `Can not delete please try again`);
      res.redirect('/users');
    } else {
      req.flash('warning', `User Removed`);
      res.redirect('/users');
    }
  });
});

module.exports = router;
