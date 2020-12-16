const mongoose = require('mongoose');
const agencies = ['NOT ASSIGN', 'TRANS-1', 'TRANS-2', 'TRANS-3', 'TRANS-4', 'TRANS-5', 'KR', 'JB', 'BKT', 'RR', 'GDL', 'MRV', 'DRJ', 'BSS'];
const services = ['ILL', 'MPLS', 'FTTH', 'P2P'];

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const FeasibilitySchema = new mongoose.Schema({
  pending: { type: Boolean, default: true },
  feasible: { type: String, uppercase: true, enum: ['YES', 'NO', 'PENDING'], default: 'PENDING' },
  media: { type: String, uppercase: true, require: true },
  name: { type: String, uppercase: true, require: true },
  givenBy: { type: String, default: '' },
  location: { type: String, uppercase: true, default: '' },
  endAStation: { type: String, uppercase: true, require: true },
  endAAddress: { type: String, uppercase: true, require: true },
  endBStation: { type: String, uppercase: true, default: '' },
  endBAddress: { type: String, uppercase: true, default: '' },
  service: { type: String, uppercase: true, enum: services, require: true },
  bandwidth: { type: String, uppercase: true, default: '' },
  prevBandwidth: { type: String, uppercase: true, default: '' },
  date: { type: Date, default: Date.now },
  remark: { type: String, uppercase: true, default: '' },
  compDate: { type: Date },
  pop: { type: String, uppercase: true, default: '' },
  estimate: { type: Number, default: 0 },
  itemList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  agency: { type: String, uppercase: true, enum: agencies, default: 'NOT ASSIGN' },
  agencyRemark: { type: String, uppercase: true, default: '' },
});

const Feasibility = mongoose.model('Feasibility', FeasibilitySchema);

module.exports = { Feasibility, agencies, services };
