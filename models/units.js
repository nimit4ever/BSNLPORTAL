const mongoose = require('mongoose');
const measurements = ['MTR', 'NOS', 'LOT'];
const types = ['COPPER', 'OFC', 'MODEM', 'EQUIPMENT', 'LABOUR', 'OTHER'];

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const UnitSchema = new mongoose.Schema({
  name: { type: String, uppercase: true, require: true },
  type: { type: String, uppercase: true, require: true, enum: types },
  measurement: { type: String, uppercase: true, require: true, enum: measurements },
  unitRate: { type: Number, require: true },
});

const Unit = mongoose.model('Unit', UnitSchema);
module.exports = { Unit, types, measurements };
