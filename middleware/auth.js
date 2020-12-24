const Joi = require('joi');
const { User } = require('../models/users');

const signupFormValidate = async function (req, res, next) {
  const schema = Joi.object({
    firstname: Joi.string().min(3).max(50).required().label('First Name'),
    lastname: Joi.string().min(3).max(50).required().label('Last Name'),
    username: Joi.string().min(5).max(50).required().label('Username'),
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().min(5).max(255).required().label('Password'),
    confirm: Joi.any().valid(Joi.ref('password')),
    role: Joi.string().label('User Role'),
    area: Joi.string().label('User Area'),
  });

  const { error } = await schema.validate(req.body);
  if (error) {
    req.flash('error', error.details[0].message);
    return res.status(400).redirect('back');
  }

  const newUser = await User.findOne({ username: req.body.username });
  if (newUser) {
    req.flash('warning', 'That user already exisits!');
    return res.status(400).redirect('back');
  }

  next();
};

const isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/auth/signin');
  }
};

const isActiveUser = function (req, res, next) {
  if (req.user.isActive) {
    return next();
  } else {
    req.flash('error', 'User inactive kindly contact Nodel Officer');
    res.redirect('/auth/signin');
  }
};

const isAdminUser = function (req, res, next) {
  if (req.user.role === 'ADMIN') {
    return next();
  } else {
    req.flash('warning', 'You have to Admin rights to do operation');
    res.redirect('/auth/signin');
  }
};

const isSuperAdminUser = function (req, res, next) {
  if (req.user.role === 'SUPERADMIN') {
    return next();
  } else {
    req.flash('warning', 'You have to Super Admin rights to do operation');
    res.redirect('/auth/signin');
  }
};

const isNodelUser = function (req, res, next) {
  if (req.user.role === 'NO') {
    return next();
  } else {
    req.flash('warning', 'You have to Nodel rights to do operation');
    res.redirect('/auth/signin');
  }
};

const isAdminOrNodelUser = function (req, res, next) {
  if (req.user.role === 'ADMIN' || req.user.role === 'NO') {
    return next();
  } else {
    req.flash('warning', 'You have to Admin or Nodel rights to do operation');
    res.redirect('/auth/signin');
  }
};

module.exports = { signupFormValidate, isLoggedIn, isActiveUser, isAdminUser, isNodelUser, isAdminOrNodelUser, isSuperAdminUser };
