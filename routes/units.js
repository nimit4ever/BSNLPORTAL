const express = require('express');
const router = express.Router();

const { Unit, types, measurements } = require('../models/units');

const { isLoggedIn, isActiveUser, isNodelUser } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const query = req.query || {};

  units = await Unit.find(query);
  res.render('./units/index', { units });
});

router.get('/api', async (req, res) => {
  units = await Unit.find({});
  res.json(units);
});

router.get('/new', async (req, res) => {
  res.render('./units/new', { types, measurements });
});

router.post('/new', async (req, res) => {
  await Unit.create(req.body, (err, newUnit) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Can not add please try again');
      res.redirect('back');
    } else {
      req.flash('success', `Created successfully unique id is ${newUnit._id}`);
      res.redirect('back');
    }
  });
});

router.get('/:id/edit', async (req, res) => {
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

router.put('/:id', async (req, res) => {
  await Unit.findByIdAndUpdate(req.params.id, req.body, (err, update) => {
    if (err || !update) {
      console.log(err);
      req.flash('error', `Can not update please try again`);
      res.redirect('back');
    } else {
      req.flash('primary', `Unit of ${update.name} vide ID: ${update._id} Updated`);
      res.redirect('/units');
    }
  });
});

router.delete('/:id', async (req, res) => {
  await Unit.findByIdAndRemove(req.params.id, (err, removed) => {
    if (err) {
      console.log(err);
      req.flash('error', `Can not delete please try again`);
      res.redirect('/units');
    } else {
      req.flash('warning', `Unit of ${removed.name} vide ID: ${removed._id} Removed`);
      res.redirect('/units');
    }
  });
});

module.exports = router;
