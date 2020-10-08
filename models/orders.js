const mongoose = require('mongoose');
const agencies = ['', 'TRANS-1', 'TRANS-2', 'TRANS-3', 'TRANS-4', 'TRANS-5', 'KR', 'JB', 'BKT', 'RR', 'GDL', 'MRV', 'DRJ'];
const reasons = [
  '',
  'COMMISSIONED',
  'CANCELLED',
  'CUSTOMER END',
  'VENDOR END',
  'TNF',
  'WIP',
  'COPPER CABLE REQ',
  'OFC CABLE REQ',
  'ORDER MODIFY REQ',
  'MLLN MODEM REQ',
  'VMUX FULL',
  'VMUX CARD REQ',
  'OFC MATERIAL REQ',
  'OTHERS',
  'CAPAX INVOLVED',
];

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const OrderSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    uppercase: true,
    require: true,
  },
  project: {
    type: String,
    uppercase: true,
    require: true,
  },
  orderId: {
    type: Number,
    uppercase: true,
    require: true,
  },
  crmId: {
    type: Number,
    default: 0,
  },
  lcId: {
    type: Number,
    default: 0,
  },
  orderType: {
    type: String,
    uppercase: true,
    require: true,
  },
  orderSubType: {
    type: String,
    uppercase: true,
    default: '',
  },
  date: {
    type: Date,
    require: true,
  },
  compDate: {
    type: Date,
  },
  task: {
    NO: { type: Boolean },
    MLLN: { type: Boolean },
    LCTX: { type: Boolean },
    LDTX: { type: Boolean },
    NIB: { type: Boolean },
  },
  bandwidth: {
    type: String,
    uppercase: true,
    require: true,
  },
  prevBandwidth: {
    type: String,
    uppercase: true,
    default: '',
  },
  cctType: {
    type: String,
    uppercase: true,
    default: '',
  },
  endAStation: {
    type: String,
    uppercase: true,
    default: '',
  },
  endAAddress: {
    type: String,
    uppercase: true,
    default: '',
  },
  endBStation: {
    type: String,
    uppercase: true,
    default: '',
  },
  endBAddress: {
    type: String,
    uppercase: true,
    default: '',
  },
  location: {
    type: String,
    uppercase: true,
    default: '',
  },
  agency: {
    type: String,
    uppercase: true,
    enum: agencies,
    default: '',
  },
  reason: {
    type: String,
    uppercase: true,
    enum: reasons,
    default: '',
  },
  remark: {
    type: String,
    uppercase: true,
    default: '',
  },
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = { Order, agencies, reasons };
