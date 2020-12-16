const express = require('express');
const router = express.Router({ mergeParams: true });

const { Feasibility } = require('../models/feasibilities');
const { Item } = require('../models/items');

const { isLoggedIn, isActiveUser } = require('../middleware/auth');

router.get('/new', [isLoggedIn, isActiveUser], async (req, res) => {
  await Feasibility.findById(req.params.id, (err, foundFeasibility) => {
    if (err || !foundFeasibility) {
      console.log(err);
      req.flash('error', 'Feasibility not found');
      res.redirect('/feasibilities');
    } else {
      res.render('./items/new', { feasibility: foundFeasibility });
    }
  });
});

router.post('/new', [isLoggedIn, isActiveUser], async (req, res) => {
  const data = {};
  data.qty = parseInt(req.body.qty);
  data.unitRate = parseFloat(req.body.unitRate);
  data.name = req.body.name.split(':')[1];
  data.amt = (data.qty * data.unitRate).toFixed(2);
  data.measurement = req.body.measurement;
  await Feasibility.findById(req.params.id, async (err, foundFeasibility) => {
    if (err || !foundFeasibility) {
      console.log(err);
      req.flash('error', 'Feasibility not found');
      res.redirect('/feasibilities');
    } else {
      await Item.create(data, async (err, newItem) => {
        if (err) {
          console.log(err);
          req.flash('error', 'Can not add please try again');
          res.redirect(`/feasibilities/${foundFeasibility._id}`);
        } else {
          foundFeasibility.itemList.push(newItem);
          await foundFeasibility.save();
          req.flash('success', `Item ${newItem.name} added`);
          res.redirect(`/feasibilities/${foundFeasibility._id}`);
        }
      });
    }
  });
});

router.delete('/:comment_id', [isLoggedIn, isActiveUser], async (req, res) => {
  await Item.findByIdAndRemove(req.params.comment_id, async (err) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Can not delete please try again');
      res.redirect('back');
    } else {
      await Feasibility.findByIdAndUpdate(req.params.id, { $pull: { itemList: req.params.comment_id } }, (err, updated) => {
        if (err) {
          console.log(err);
          req.flash('error', 'Can not delete please try again');
          res.redirect('back');
        } else {
          req.flash('warning', 'Item Removed');
          res.redirect(`/feasibilities/${req.params.id}`);
        }
      });
    }
  });
});

module.exports = router;
