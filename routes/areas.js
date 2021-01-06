const express = require('express');
const router = express.Router();

const { Area } = require('../models/areas');

const { isLoggedIn, isActiveUser, isAdminUser } = require('../middleware/auth');

router.get('/', [isLoggedIn, isActiveUser, isAdminUser], async (req, res) => {
  areas = await Area.find({});
  res.render('./areas/index', { areas });
});

router.get('/api', async (req, res) => {
  areas = await Area.find({});
  res.json(areas);
});

router.get('/new', [isLoggedIn, isActiveUser, isAdminUser], async (req, res) => {
  res.render('./areas/new');
});

router.post('/new', [isLoggedIn, isActiveUser, isAdminUser], async (req, res) => {
  await Area.create(req.body, (err, newArea) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Can not add please try again');
      res.redirect('back');
    } else {
      req.flash('success', `Created successfully`);
      res.redirect('/areas');
    }
  });
});

router.get('/:id', [isLoggedIn, isActiveUser, isAdminUser], async (req, res) => {
  await Area.findById(req.params.id, async (err, found) => {
    if (err || !found) {
      console.log(err);
      req.flash('error', 'Area not found');
      res.redirect('/areas');
    } else {
      res.render('./areas/show', { area: found });
    }
  });
});

router.put('/:id/addrole', [isLoggedIn, isActiveUser, isAdminUser], async (req, res) => {
  if (req.body.role && req.body.role !== '') {
    const area = await Area.findById(req.params.id);
    if (!area) {
      req.flash('error', `Can not find Area please try again`);
      res.redirect('back');
    } else {
      area.role.push(req.body.role);
      await area.save((err) => {
        if (err) {
          req.flash('error', `Can not add please try again`);
          res.redirect('back');
        }
        req.flash('success', `${req.body.role} added successfully in the Area ${area.name}`);
        res.redirect('back');
      });
    }
  } else {
    req.flash('error', `Can not add please try again`);
    res.redirect('back');
  }
});

router.delete('/:id', [isLoggedIn, isActiveUser, isAdminUser], async (req, res) => {
  await Area.findByIdAndRemove(req.params.id, (err, removed) => {
    if (err) {
      console.log(err);
      req.flash('error', `Can not delete please try again`);
      res.redirect('/areas');
    } else {
      req.flash('warning', `Area Removed`);
      res.redirect('/areas');
    }
  });
});

module.exports = router;
