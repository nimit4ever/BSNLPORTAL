const express = require('express');
const router = express.Router();

const { Feasibility, services } = require('../models/feasibilities');
const { Item } = require('../models/items');

const { FeasibilityQueryBuild } = require('../utils/feasibilities/feasibilityQueryBuild');

const { isLoggedIn, isActiveUser, isAdminUser, isAdminOrNodelUser } = require('../middleware/auth');
const { feasibilityMail } = require('../utils/feasibilities/feasibilityMail');

router.get('/', [isLoggedIn, isActiveUser], async (req, res) => {
  let findObj = {};
  if (req.query && req.user && req.user.role && req.user.area) {
    findObj = new FeasibilityQueryBuild(req.user, req.query);
  } else if (req.user && req.user.role && req.user.area) {
    findObj = new FeasibilityQueryBuild(req.user);
  } else {
    findObj = { select: 'NONE' };
  }

  feasibilities = await Feasibility.find(findObj);
  res.render('./feasibilities/index', { feasibilities });
});

router.get('/api', [isLoggedIn, isActiveUser], async (req, res) => {
  let findObj = {};
  if (req.query && req.user && req.user.role && req.user.area) {
    findObj = new FeasibilityQueryBuild(req.user, req.query);
  } else if (req.user && req.user.role && req.user.area) {
    findObj = new FeasibilityQueryBuild(req.user);
  } else {
    findObj = { select: 'NONE' };
  }

  feasibilities = await Feasibility.find(findObj);
  res.json(feasibilities);
});

router.get('/new', [isLoggedIn, isActiveUser, isAdminOrNodelUser], async (req, res) => {
  res.render('./feasibilities/new', { services });
});

router.post('/new', [isLoggedIn, isActiveUser, isAdminOrNodelUser], async (req, res) => {
  req.body.createBy = req.user.username;
  await Feasibility.create(req.body, (err, newFeasibility) => {
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

router.get('/:id', [isLoggedIn, isActiveUser], async (req, res) => {
  await Feasibility.findById(req.params.id)
    .populate('itemList')
    .exec(async (err, found) => {
      if (err || !found) {
        console.log(err);
        req.flash('error', 'Feasibility not found');
        res.redirect('/feasibilities');
      } else {
        if (found.pending) {
          found.estimate = found.itemList
            .reduce((comm, item) => {
              return (comm += item.amt);
            }, 0)
            .toFixed(2);

          await found.save();
        }
        res.render('feasibilities/show', { feasibility: found });
      }
    });
});

router.get('/:id/edit', [isLoggedIn, isActiveUser, isAdminOrNodelUser], async (req, res) => {
  await Feasibility.findById(req.params.id, (err, found) => {
    if (err || !found) {
      console.log(err);
      req.flash('error', 'Feasibility not found');
      res.redirect('back');
    } else {
      res.render('feasibilities/edit', { feasibility: found, services });
    }
  });
});

router.put('/:id', [isLoggedIn, isActiveUser], async (req, res) => {
  const update = await Feasibility.findById(req.params.id);
  if (update && update.pending) {
    const data = req.body;
    if (data.feasible && (data.feasible === 'YES' || data.feasible === 'NO')) {
      data.compDate = new Date();
      data.pending = false;
      data.givenBy = req.user.username;
    }
    try {
      let feasibility = await Feasibility.findOneAndUpdate({ _id: req.params.id }, data);
      await feasibility.save((err) => {
        if (err) throw err;
      });

      if (data.feasible && (data.feasible === 'YES' || data.feasible === 'NO')) {
        feasibilityMail(req.params.id, req.user.email);
      }
      req.flash('primary', `Feasibility Updated`);
      res.redirect('/feasibilities');
    } catch (err) {
      console.log(err.message);
      req.flash('error', `Can not update Feasibility: ${req.params.id}`);
      res.redirect(back);
    }
  } else {
    req.flash('error', `Can not update please contact Admin to Reset`);
    res.redirect('back');
  }
});

router.put('/:id/reset', [isLoggedIn, isActiveUser, isAdminUser], async (req, res) => {
  const update = await Feasibility.findById(req.params.id);
  if (!update) {
    req.flash('error', `Can not find feasibility to Reset`);
    res.redirect('back');
  } else {
    update.feasible = 'PENDING';
    update.compDate = '';
    update.pending = true;
    update.givenBy = '';
    await update.save((err) => {
      if (err) {
        req.flash('error', `Can not reset please try again`);
        res.redirect('back');
      } else {
        req.flash('primary', `Feasibility Reset`);
        res.redirect('/feasibilities');
      }
    });
  }
});

router.delete('/:id', [isLoggedIn, isActiveUser, isAdminUser], async (req, res) => {
  const removed = await Feasibility.findById(req.params.id);
  await Item.deleteMany({ _id: { $in: removed.itemList } }, (err) => {
    if (err) {
      console.log(err);
      req.flash('error', `Can not delete please try again`);
      res.redirect('/feasibilities');
    }
  });
  await Feasibility.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(err);
      req.flash('error', `Can not delete please try again`);
      res.redirect('/feasibilities');
    } else {
      req.flash('warning', `Feasibility Removed`);
      res.redirect('/feasibilities');
    }
  });
});

router.get('/bulk', [isLoggedIn, isActiveUser, isAdminOrNodelUser], async (req, res) => {
  res.render('./feasibilities/bulk', { services });
});

router.post('/bulk', [isLoggedIn, isActiveUser, isAdminOrNodelUser], async (req, res) => {});

module.exports = router;
