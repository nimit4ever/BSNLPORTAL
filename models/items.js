const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const ItemSchema = new mongoose.Schema({
  name: { type: String, require: true },
  measurement: { type: String, require: true },
  qty: { type: Number, require: true },
  unitRate: { type: Number, require: true },
  amt: { type: Number, default: 0 },
});

const Item = mongoose.model('Item', ItemSchema);
module.exports = { Item };
