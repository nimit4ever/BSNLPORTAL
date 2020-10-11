const fs = require('fs');
const schedule = require('node-schedule');

const { Order } = require('../../models/orders');

const fetchOrders = require('./fetchOrders');
const filterOrders = require('./filterOrders');

// Helper Function
const rule = new schedule.RecurrenceRule();
rule.hour = [new schedule.Range(10, 18)];
rule.minute = 0;

try {
  const j = schedule.scheduleJob(rule, fetchAreaOrder);
} catch (err) {
  console.log(err.message);
}

async function updateTask(oldTasks, newTasks = {}) {
  if (newTasks.NO === undefined) {
    if (oldTasks.NO === false) oldTasks.NO = true;
  } else {
    oldTasks.NO = false;
  }

  if (newTasks.NIB === undefined) {
    if (oldTasks.NIB === false) oldTasks.NIB = true;
  } else {
    oldTasks.NIB = false;
  }

  if (newTasks.MLLN === undefined) {
    if (oldTasks.MLLN === false) oldTasks.MLLN = true;
  } else {
    oldTasks.MLLN = false;
  }

  if (newTasks.LCTX === undefined) {
    if (oldTasks.LCTX === false) oldTasks.LCTX = true;
  } else {
    oldTasks.LCTX = false;
  }

  if (newTasks.LDTX === undefined) {
    if (oldTasks.LDTX === false) oldTasks.LDTX = true;
  } else {
    oldTasks.LDTX = false;
  }
}

async function fetchAreaOrder(area = 'RJT') {
  const findObj = { $or: [{ endAStation: area }, { endBStation: area }], isActive: true };
  const totalOrders = await fetchOrders(area);
  if (totalOrders.length === 0) {
    throw new Error('Can not connect to the database');
  } else {
    const projects = await JSON.parse(fs.readFileSync('./project.json'));
    const orders = filterOrders(totalOrders);
    const dbOrders = await Order.find(findObj);

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
            throw err;
          }
        });
      } else {
        updateTask(foundOrder, order);
        await foundOrder.save((err) => {
          if (err) {
            throw err;
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
        updateTask(dbOrder);
        dbOrder.isActive = false;
        await dbOrder.save((err) => {
          if (err) {
            throw err;
          }
        });
      }
    }
    console.log(`${area} Database Updated Successfully at ${new Date()}`);
  }
}

class Query {
  constructor({ query = undefined, user = undefined }) {
    if (query) {
      if (query.isActive) {
        this.isActive = query.isActive && query.isActive == 0 ? false : true;
      }

      if (user && user.area) {
        this.$or = [{ endAStation: user.area }, { endBStation: user.area }];
      } else if (query.area) {
        this.$or = [{ endAStation: query.area }, { endBStation: query.area }];
      } else {
        this.$or = [{ endAStation: 'NONE' }, { endBStation: 'NONE' }];
      }

      if (user && user.role && user.role !== 'NO') {
        this[user.role] = { $exists: true };
      } else if (query.role) {
        this[query.role] = { $exists: true };
      }

      if (query.reason) {
        if (query.reason === 'INCOMPLETE') {
          this.reason = { $not: { $in: ['COMMISSIONED', 'CANCELLED'] } };
        } else {
          this.reason = query.reason;
        }
      }
      if (query.agency) this.agency = query.agency != 0 ? query.agency : '';
      if (query.orderType) this.orderType = query.orderType;
    }
  }
}

module.exports = { fetchAreaOrder, Query };
