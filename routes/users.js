const express = require('express');
const router = express.Router({ mergeParams: true });

const { User, roles, areas } = require('../models/users');
const { Order, agencies, reasons } = require('../models/orders');

const { isLoggedIn, isActiveUser } = require('../middleware/auth');

// USER PROFILE
router.get('/dashboard', [isLoggedIn], async (req, res) => {
  orders = await Order.find({});
  res.render('./users/dashboard', { orders });
});

router.get('/', async (req, res) => {
  const query = req.query || {};

  users = await User.find(query);
  res.render('./users/index', { users });
});

router.get('/:id/edit', async (req, res) => {
  await User.findById(req.params.id, function (err, found) {
    if (err || !found) {
      console.log(err);
      req.flash('error', 'User not found');
      res.redirect('back');
    } else {
      res.render('users/edit', { user: found, roles, areas });
    }
  });
});

router.put('/:id', async (req, res) => {
  req.body.isActive ? (req.body.isActive = true) : (req.body.isActive = false);
  await User.findByIdAndUpdate(req.params.id, req.body, (err, update) => {
    if (err || !update) {
      console.log(err);
      req.flash('error', `Can not update please try again`);
      res.redirect('back');
    } else {
      req.flash('primary', `User of ${update.username} vide ID: ${update._id} Updated`);
      res.redirect('/users');
    }
  });
});

router.delete('/:id', async (req, res) => {
  await User.findByIdAndRemove(req.params.id, (err, removed) => {
    if (err) {
      console.log(err);
      req.flash('error', `Can not delete please try again`);
      res.redirect('/users');
    } else {
      req.flash('warning', `User of ${removed.username} vide ID: ${removed._id} Removed`);
      res.redirect('/users');
    }
  });
});

module.exports = router;
