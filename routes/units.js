const express = require('express');
const router = express.Router();

const { Unit, types, measurements } = require('../models/units');

const { isLoggedIn, isActiveUser, isAdminOrNodelUser } = require('../middleware/auth');

router.get('/', [isLoggedIn, isActiveUser], async (req, res) => {
  const query = req.query || {};

  units = await Unit.find(query);
  res.render('./units/index', { units });
});

router.get('/api', [isLoggedIn, isActiveUser], async (req, res) => {
  units = await Unit.find({});
  res.json(units);
});

router.get('/new', [isLoggedIn, isActiveUser, isAdminOrNodelUser], async (req, res) => {
  res.render('./units/new', { types, measurements });
});

router.post('/new', [isLoggedIn, isActiveUser, isAdminOrNodelUser], async (req, res) => {
  await Unit.create(req.body, (err, newUnit) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Can not add please try again');
      res.redirect('back');
    } else {
      req.flash('success', `Created successfully`);
      res.redirect('back');
    }
  });
});

router.get('/:id/edit', [isLoggedIn, isActiveUser, isAdminOrNodelUser], async (req, res) => {
  await Unit.findById(req.params.id, function (err, found) {
    if (err || !found) {
      console.log(err);
      req.flash('error', 'Unit not found');
      res.redirect('back');
    } else {
      res.render('units/edit', { unit: found, types, measurements });
    }
  });
});

router.put('/:id', [isLoggedIn, isActiveUser, isAdminOrNodelUser], async (req, res) => {
  await Unit.findByIdAndUpdate(req.params.id, req.body, (err, update) => {
    if (err || !update) {
      console.log(err);
      req.flash('error', `Can not update please try again`);
      res.redirect('back');
    } else {
      req.flash('primary', `Unit Updated`);
      res.redirect('/units');
    }
  });
});

router.delete('/:id', [isLoggedIn, isActiveUser, isAdminOrNodelUser], async (req, res) => {
  await Unit.findByIdAndRemove(req.params.id, (err, removed) => {
    if (err) {
      console.log(err);
      req.flash('error', `Can not delete please try again`);
      res.redirect('/units');
    } else {
      req.flash('warning', `Unit Removed`);
      res.redirect('/units');
    }
  });
});

module.exports = router;
