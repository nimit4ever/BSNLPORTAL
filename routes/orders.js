const fs = require('fs');
const express = require('express');
const router = express.Router();
const moment = require('moment');

const { Order, agencies, reasons } = require('../models/orders');

const fetchOrders = require('../utils/orders/fetchOrders');
const filterOrders = require('../utils/orders/filterOrders');
const { updateTask, fetchqueryBuild, Query } = require('../utils/orders/orders');
const { isLoggedIn, isActiveUser, isNodelUser } = require('../middleware/auth');

router.get('/', [isLoggedIn, isActiveUser], async (req, res) => {
  const { findObj } = new Query(req);
  console.log(findObj);
  orders = await Order.find(findObj);
  res.render('./orders/index', { orders });
});

router.post('/new', [isLoggedIn, isActiveUser, isNodelUser], async (req, res) => {
  const { findObj, area } = fetchqueryBuild(req.query);
  const totalOrders = await fetchOrders(area);
  if (totalOrders.length === 0) {
    req.flash('error', 'Can not connect to the database');
    res.redirect('back');
  } else {
    const projects = await JSON.parse(fs.readFileSync('./project.json'));
    const orders = filterOrders(totalOrders);
    const dbOrders = await Order.find(findObj);
    const removedOrders = [];
    const newOrders = [];

    for (order of orders) {
      const foundOrder = await Order.findOne({ orderId: order.orderId });
      if (!foundOrder) {
        const project = projects.find((project) => {
          return order.name.toUpperCase().search(project.key.toUpperCase()) !== -1;
        });
        if (!project) {
          order.project = order.name;
        } else {
          order.project = project.value;
        }
        await Order.create(order, (err, newOrder) => {
          if (err) {
            console.log(err.message);
            req.flash('error', `Can not create Order: ${order.orderId}`);
            res.redirect('/orders');
          } else {
            newOrders.push(newOrder);
          }
        });
      } else {
        updateTask(foundOrder.task, order.task);
        await foundOrder.save((err) => {
          if (err) {
            console.log(err.message);
            req.flash('error', `Can not update Order: ${foundOrder.orderId}`);
            res.redirect('/orders');
          }
        });
      }
    }

    for (dbOrder of dbOrders) {
      const foundOrder = orders.find((order) => {
        return dbOrder.orderId === order.orderId;
      });

      if (!foundOrder) {
        dbOrder.compDate = new Date();
        updateTask(dbOrder.task);
        dbOrder.isActive = false;
        await dbOrder.save((err) => {
          if (err) {
            console.log(err.message);
            req.flash('error', `Can not update Order: ${dbOrder.orderId}`);
            res.redirect('/orders');
          }
        });
        removedOrders.push(dbOrder);
      }
    }
    req.flash('success', 'Database Updated Successfully');
    res.json({ newOrders, removedOrders });
  }
});

router.get('/:id/edit', [isLoggedIn, isActiveUser, isNodelUser], async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.id });
  if (!order) {
    req.flash('error', `Can not find Order: ${req.params.id}`);
    res.redirect('/orders');
  } else {
    res.render('./orders/edit', { order, reasons, agencies });
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
