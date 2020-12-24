const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const AreaSchema = new mongoose.Schema({
  name: { type: String, uppercase: true, require: true },
  role: { type: [String], default: ['NOT ASSIGN', 'ADMIN', 'NO', 'NIB', 'MLLN', 'LCTX', 'LDTX'] },
  reason: {
    type: [String],
    default: [
      'NOT ASSIGN',
      'COMMISSIONED',
      'CANCELLED',
      'CUSTOMER END',
      'VENDOR END',
      'TNF',
      'WIP',
      'COPPER CABLE REQ',
      'OFC CABLE REQ',
      'OFC MATERIAL REQ',
      'ORDER MODIFY REQ',
      'MLLN MODEM REQ',
      'VMUX CARD REQ',
      'VMUX FULL',
      'CAPAX INVOLVED',
      'OTHERS',
    ],
  },
});

const Area = mongoose.model('Area', AreaSchema);
module.exports = { Area };
