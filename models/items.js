const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const ItemSchema = new mongoose.Schema({
  name: { type: String, uppercase: true, require: true },
  measurement: { type: String, uppercase: true, require: true },
  qty: { type: Number, require: true },
  unitRate: { type: Number, require: true },
  amt: { type: Number, default: 0 },
});

const Item = mongoose.model('Item', ItemSchema);
module.exports = { Item };
