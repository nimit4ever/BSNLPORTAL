const express = require('express');
const router = express.Router({ mergeParams: true });

const { User } = require('../models/users');
const { Order, agencies, reasons } = require('../models/orders');

const { isLoggedIn, isActiveUser } = require('../middleware/auth');

// USER PROFILE
router.get('/dashboard', [isLoggedIn], async (req, res) => {
  orders = await Order.find({});
  res.render('./users/dashboard', { orders });
});

router.get('/:id', function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (err) {
      req.flash('error', 'Something went wrong.');
      res.redirect('back');
    }
    Campground.find()
      .where('author.id')
      .equals(foundUser._id)
      .exec(function (err, campgrounds) {
        if (err) {
          req.flash('error', 'Something went wrong.');
          res.redirect('back');
        }
        res.render('users/show', { user: foundUser, campgrounds: campgrounds });
      });
  });
});

module.exports = router;
