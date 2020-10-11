const axios = require('axios');
const qs = require('qs');
const htmlTableToJson = require('html-table-to-json');
const fs = require('fs');

function addTask(fOrder, task) {
  if (task.search('_NO') !== -1) {
    fOrder.NO = false;
  } else if (task.search('_LCNIB') !== -1) {
    fOrder.NIB = false;
  } else if (task.search('_LCTX') !== -1) {
    fOrder.LCTX = false;
  } else if (task.search('_LDTX') !== -1) {
    fOrder.LDTX = false;
  } else if (task.search('_LCMLLN') !== -1) {
    fOrder.MLLN = false;
  }
}

module.exports = (orders) => {
  totalOrders = [];
  for (order of orders) {
    let fOrder = totalOrders.find((foundOrder) => {
      if (foundOrder.orderId === parseInt(order.SERO_ID)) return foundOrder;
    });
    if (!fOrder) {
      fOrder = {};
      fOrder.name = order.SUBSCRIBER;
      fOrder.orderId = parseInt(order.SERO_ID);
      if (order.ORDER_SUB_TYPE.substring(0, 5) === 'Shift') {
        fOrder.orderType = `Shift ${order.ORDER_TYPE}`;
      } else {
        fOrder.orderType = order.ORDER_TYPE;
      }
      fOrder.orderSubType = order.ORDER_SUB_TYPE;
      fOrder.date = new Date(order.ORDER_DATE);
      fOrder.bandwidth = order.CURRENT_BANDWIDTH;
      fOrder.cctType = order.CIRCUIT_TYPE.split(' ')[0];
      if (order.PREV_BANDWIDTH === 'null') {
        fOrder.prevBandwidth = '';
      } else {
        fOrder.prevBandwidth = order.PREV_BANDWIDTH;
      }
      if (order.CRM_ORDER_ID === 'null') {
        fOrder.crmId = 0;
      } else {
        fOrder.crmId = parseInt(order.CRM_ORDER_ID);
      }
      fOrder.lcId = parseInt(order.LC_CIRCUIT_ID);
      if (order.ENDA_SSA !== 'null') {
        fOrder.endAStation = order.ENDA_SSA;
        fOrder.endAAddress = order.ADDRESS_AEND;
      }
      if (order.ENDB_SSA !== 'null') {
        fOrder.endBStation = order.ENDB_SSA;
        fOrder.endBAddress = order.ADDRESS_BEND;
      }
      totalOrders.push(fOrder);
    }
    addTask(fOrder, order.WRG);
  }
  return totalOrders;
};
