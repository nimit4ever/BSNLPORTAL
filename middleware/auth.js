const Joi = require('joi');
const { User, roles, areas } = require('../models/users');

const signupFormValidate = async function (req, res, next) {
  const schema = Joi.object({
    firstname: Joi.string().min(3).max(50).required().label('First Name'),
    lastname: Joi.string().min(3).max(50).required().label('Last Name'),
    username: Joi.string().min(5).max(50).required().label('Username'),
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().min(5).max(255).required().label('Password'),
    confirm: Joi.any().valid(Joi.ref('password')),
    role: Joi.string()
      .valid(...roles)
      .label('User Role'),
    area: Joi.string()
      .valid(...areas)
      .label('User Area'),
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
    req.flash('warning', 'You need to Login First');
    res.redirect('/auth/signin');
  }
};

const isActiveUser = function (req, res, next) {
  if (req.user.isActive) {
    return next();
  } else {
    req.flash('error', 'User was Inactive');
    res.redirect('/auth/signin');
  }
};

const isAdminUser = function (req, res, next) {
  if (req.user.role === 'ADMIN') {
    return next();
  } else {
    req.flash('warning', 'To create new User you have Admin rights');
    res.redirect('/auth/signin');
  }
};

module.exports = { signupFormValidate, isLoggedIn, isActiveUser, isAdminUser };
