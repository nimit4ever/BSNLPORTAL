const fs = require('fs');
const express = require('express');
const router = express.Router();

const { Order, agencies, reasons } = require('../models/orders');

const { fetchAreaOrder, Query } = require('../utils/orders/orders');
const { isLoggedIn, isActiveUser, isNodelUser } = require('../middleware/auth');

router.get('/', [isLoggedIn, isActiveUser], async (req, res) => {
  const findObj = new Query(req);
  orders = await Order.find(findObj);
  res.render('./orders/index', { orders });
});

router.get('/api', [isLoggedIn, isActiveUser], async (req, res) => {
  const findObj = new Query(req);
  orders = await Order.find(findObj);
  res.json(orders);
});

router.post('/new', [isLoggedIn, isActiveUser, isNodelUser], async (req, res) => {
  const area = req.query.area;
  try {
    await fetchAreaOrder(area);
  } catch (err) {
    console.log(err.message);
    req.flash('error', 'Can not connect to the database');
    res.redirect('back');
  }
  req.flash('success', 'Database Updated Successfully');
  res.redirect('back');
});

router.get('/:id/edit', [isLoggedIn, isActiveUser, isNodelUser], async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.id });
  if (!order) {
    req.flash('error', `Can not find Order: ${req.params.id}`);
    res.redirect('/orders');
  } else {
    res.render('./orders/edit', { order, agencies, reasons });
  }
});

router.put('/:id/edit', [isLoggedIn, isActiveUser, isNodelUser], async (req, res) => {
  const order = await Order.findOneAndUpdate({ orderId: req.params.id }, req.body);
  if (!order) {
    req.flash('error', `Can not find Order: ${req.params.id}`);
    res.redirect('/orders');
  } else {
    await order.save((err) => {
      if (err) {
        console.log(err.message);
        req.flash('error', `Can not update Order: ${req.params.id}`);
        res.redirect('/orders');
      }
    });
    req.flash('success', `${req.params.id} :  Saved Successfully`);
    res.redirect('/orders');
  }
});

module.exports = router;
