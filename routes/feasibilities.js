const express = require('express');
const router = express.Router();

const { Feasibility, agencies, services } = require('../models/feasibilities');

const { isLoggedIn, isActiveUser, isNodelUser } = require('../middleware/auth');
const stations = ['RJT'];

router.get('/', async (req, res) => {
  feasibilities = await Feasibility.find({});
  res.render('./feasibilities/index', { feasibilities });
});

router.get('/new', async (req, res) => {
  res.render('./feasibilities/new', { agencies, stations, services });
});

router.post('/new', async (req, res) => {
  await Feasibility.create(req.body, (err, newFeasibility) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Can not add please try again');
      res.redirect('back');
    } else {
      req.flash('success', `Created successfully unique id is ${newFeasibility._id}`);
      res.redirect('back');
    }
  });
});

router.get('/:id', async (req, res) => {
  await Feasibility.findById(req.params.id)
    .populate('itemList')
    .exec(async (err, found) => {
      if (err || !found) {
        console.log(err);
        req.flash('error', 'Feasibility not found');
        res.redirect('/feasibilities');
      } else {
        found.estimate = found.itemList
          .reduce((comm, item) => {
            return (comm += item.amt);
          }, 0)
          .toFixed(2);

        await found.save();
        res.render('feasibilities/show', { feasibility: found });
      }
    });
});

router.get('/:id/edit', async (req, res) => {
  await Feasibility.findById(req.params.id, function (err, found) {
    if (err || !found) {
      console.log(err);
      req.flash('error', 'Feasibility not found');
      res.redirect('back');
    } else {
      res.render('feasibilities/edit', { feasibility: found, agencies, stations, services });
    }
  });
});

router.put('/:id', async (req, res) => {
  const data = req.body;
  if (data.feasible && (data.feasible === 'YES' || data.feasible === 'NO')) {
    data.compDate = new Date();
    data.pending = false;
  }

  await Feasibility.findByIdAndUpdate(req.params.id, data, (err, update) => {
    if (err || !update) {
      console.log(err);
      req.flash('error', `Can not update please try again`);
      res.redirect('back');
    } else {
      req.flash('primary', `Feasibility of ${update.name} vide ID: ${update._id} Updated`);
      res.redirect('/feasibilities');
    }
  });
});

router.delete('/:id', async (req, res) => {
  await Feasibility.findByIdAndRemove(req.params.id, (err, removed) => {
    if (err) {
      console.log(err);
      req.flash('error', `Can not delete please try again`);
      res.redirect('/feasibilities');
    } else {
      Item.deleteMany({ _id: { $in: removed.itemList } }, (err) => {
        if (err) {
          console.log(err);
          req.flash('error', `Can not delete please try again`);
          res.redirect('/feasibilities');
        } else {
          req.flash('warning', `Feasibility of ${removed.name} vide ID: ${removed._id} Removed`);
          res.redirect('/feasibilities');
        }
      });
    }
  });
});

module.exports = router;
