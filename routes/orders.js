const express = require('express');
const router = express.Router();
const fs = require('fs');
const pdf = require('html-pdf');

const { Order } = require('../models/orders');

const { fetchAreaOrders } = require('../utils/orders/fetchAreaOrders');
const { orderFetch } = require('../utils/orders/orderFetch');
const { OrderQueryBuild } = require('../utils/orders/orderQueryBuild');
const { isLoggedIn, isActiveUser, isAdminOrNodelUser } = require('../middleware/auth');

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

router.post('/new', [isLoggedIn, isActiveUser, isAdminOrNodelUser], async (req, res) => {
  try {
    await fetchAreaOrders(req.user.area);
    req.flash('success', 'Database Updated Successfully');
    res.redirect('/orders');
  } catch (err) {
    console.log(err.message);
    req.flash('error', 'Can not Sync database');
    res.redirect('/orders');
  }
});

router.get('/:id', [isLoggedIn, isActiveUser, isAdminOrNodelUser], async (req, res) => {
  try {
    const orderHtml = await orderFetch(req.params.id);
    if (!orderHtml) {
      throw 'Can not connect to the server, please try later';
    } else {
      // const html = fs.readFileSync('./my.html', 'utf8');
      const options = { format: 'A4' };
      await pdf.create(orderHtml, options).toStream(function (err, stream) {
        if (err) {
          throw 'PDF file can not be created';
        } else {
          res.attachment(`${req.params.id}.pdf`);
          stream.pipe(res);
        }
      });
    }
  } catch (err) {
    req.flash('error', err);
    res.redirect('back');
  }
});

router.get('/:id/edit', [isLoggedIn, isActiveUser, isAdminOrNodelUser], async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.id });
  if (!order) {
    req.flash('error', `Can not find Order: ${req.params.id}`);
    res.redirect('back');
  } else {
    referer = req.headers.referer.split(':3000')[1];
    res.render('./orders/edit', { order });
  }
});

router.put('/:id/edit', [isLoggedIn, isActiveUser, isAdminOrNodelUser], async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate({ orderId: req.params.id }, req.body);
    await order.save((err) => {
      if (err) throw err;
    });
    req.flash('success', `${req.params.id} :  Saved Successfully`);
    res.redirect(referer);
  } catch (err) {
    console.log(err.message);
    req.flash('error', `Can not update Order: ${req.params.id}`);
    res.redirect(referer);
  }
});

module.exports = router;
