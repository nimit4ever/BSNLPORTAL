const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const roles = ['ADMIN', 'NO', 'LCTX', 'MLLN', 'LDTX', 'NIB', 'USER'];
const areas = ['RJT', 'NONE'];

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const UserSchema = new mongoose.Schema({
  firstname: { type: String, uppercase: true, required: true, minlength: 3, maxlength: 50 },
  lastname: { type: String, uppercase: true, required: true, minlength: 3, maxlength: 50 },
  username: { type: String, lowercase: true, required: true, minlength: 5, maxlength: 50, unique: true },
  email: { type: String, lowercase: true, required: true, minlength: 5, maxlength: 255, unique: true },
  isActive: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  role: { type: String, uppercase: true, enum: roles, default: 'USER' },
  area: { type: String, uppercase: true, enum: areas, default: 'NONE' },
  resetPasswordToken: { type: String, default: undefined },
  resetPasswordExpires: { type: Date, default: undefined },
});

UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', UserSchema);
module.exports = { User, roles, areas };
