const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const UserSchema = new mongoose.Schema({
  firstname: { type: String, uppercase: true, required: true, minlength: 3, maxlength: 50 },
  lastname: { type: String, uppercase: true, required: true, minlength: 3, maxlength: 50 },
  username: { type: Number, required: true, min: 7000000000, max: 9999999999, unique: true },
  email: { type: String, lowercase: true, required: true, minlength: 5, maxlength: 255, unique: true },
  isActive: { type: Boolean, default: true },
  created: { type: Date, default: Date.now },
  role: { type: String, uppercase: true, default: 'NONE' },
  area: { type: String, uppercase: true, default: 'NONE' },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', UserSchema);
module.exports = { User };
