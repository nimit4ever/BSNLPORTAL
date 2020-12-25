const fs = require('fs');
const express = require('express');
const router = express.Router();

const { Order } = require('../models/orders');

const { fetchAreaOrders } = require('../utils/orders/fetchAreaOrders');
const { OrderQueryBuild } = require('../utils/orders/orderQueryBuild');
const { isLoggedIn, isActiveUser, isNodelUser } = require('../middleware/auth');

let referer = '';

router.get('/', [isLoggedIn, isActiveUser], async (req, res) => {
  let findObj = {};
  if (req.query && req.user && req.user.role && req.user.area) {
    findObj = new OrderQueryBuild(req.user, req.query);
  } else if (req.user && req.user.role && req.user.area) {
    findObj = new OrderQueryBuild(req.user);
  } else {
    findObj = { select: 'NONE' };
  }
  orders = await Order.find(findObj);
  res.render('./orders/index', { orders });
});

router.get('/api', [isLoggedIn, isActiveUser], async (req, res) => {
  let findObj = {};
  if (req.query && req.user && req.user.role && req.user.area) {
    findObj = new OrderQueryBuild(req.user, req.query);
  } else if (req.user && req.user.role && req.user.area) {
    findObj = new OrderQueryBuild(req.user);
  } else {
    findObj = { select: 'NONE' };
  }
  orders = await Order.find(findObj);
  res.json(orders);
});

router.post('/new', [isLoggedIn, isActiveUser, isNodelUser], async (req, res) => {
  if (req.user && req.user.area) {
    try {
      await fetchAreaOrders(req.user.area);
    } catch (err) {
      console.log(err.message);
      req.flash('error', 'Can not connect to the database');
      res.redirect('back');
    }
    req.flash('success', 'Database Updated Successfully');
    res.redirect('back');
  } else {
    req.flash('error', 'Can not fetch');
    res.redirect('back');
  }
});

router.get('/:id/edit', [isLoggedIn, isActiveUser, isNodelUser], async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.id });
  if (!order) {
    req.flash('error', `Can not find Order: ${req.params.id}`);
    res.redirect('back');
  } else {
    referer = req.headers.referer.split(':3000')[1];
    res.render('./orders/edit', { order });
  }
});

router.put('/:id/edit', [isLoggedIn, isActiveUser, isNodelUser], async (req, res) => {
  const order = await Order.findOneAndUpdate({ orderId: req.params.id }, req.body);
  console.log(req.body);
  if (!order) {
    req.flash('error', `Can not find Order: ${req.params.id}`);
    res.redirect(referer);
  } else {
    await order.save((err) => {
      if (err) {
        console.log(err.message);
        req.flash('error', `Can not update Order: ${req.params.id}`);
        res.redirect(referer);
      }
    });
    req.flash('success', `${req.params.id} :  Saved Successfully`);
    res.redirect(referer);
  }
});

module.exports = router;
