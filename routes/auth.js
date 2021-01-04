const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { User } = require('../models/users');
const { signupFormValidate } = require('../middleware/auth');

// Root
router.get('/', (req, res) => {
  res.redirect('/auth/signin');
});

// Signup Form
router.get('/signup', (req, res) => {
  res.render('./auth/signup');
});

// Signup Handle
router.post('/signup', [signupFormValidate], async (req, res) => {
  newUser = new User(req.body);
  User.register(newUser, req.body.password, async (err, user) => {
    if (err) {
      console.log(err);
      req.flash('error', err.message);
      return res.status(400).redirect('back');
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('success', `Successfully Signed Up! Nice to meet you ${req.body.firstname} ${req.body.lastname}`);
      res.redirect('/users/dashboard');
    });
  });
});

//	Signin form
router.get('/signin', (req, res) => {
  res.render('./auth/signin');
});

// Signin Handle
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/auth/signin',
    failureFlash: true,
    failureFlash: 'Invalid Username or Password...! Please try Again...!',
  }),
  (req, res) => {
    req.flash('success', `Welcome ${req.user.firstname} ${req.user.lastname}`);
    res.redirect('/users/dashboard');
  }
);

// Signout
router.get('/signout', (req, res) => {
  req.logout();
  req.flash('primary', 'Goodbye see you again...!');
  res.redirect('/auth/signin');
});

// Forgot form
router.get('/forgot', (req, res) => {
  res.render('./auth/forgot');
});

// Forgot Handle
router.post('/forgot', (req, res, next) => {
  async.waterfall(
    [
      (done) => {
        crypto.randomBytes(20, (err, buf) => {
          const token = buf.toString('hex');
          done(err, token);
        });
      },
      (token, done) => {
        User.findOne({ email: req.body.email }, (err, user) => {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('back');
          }
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          user.save((err) => {
            done(err, token, user);
          });
        });
      },
      (token, user, done) => {
        const smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.GMAILUSER,
            pass: process.env.GMAILPASS,
          },
        });
        const mailOptions = {
          to: user.email,
          from: process.env.GMAILUSER,
          subject: 'Leased Portal Password Reset',
          text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.

            Please click on the following link, or paste this into your browser to complete the process:

            http://${req.headers.host}/auth/reset/${token}
            
            If you did not request this, please ignore this email and your password will remain unchanged.`,
        };
        smtpTransport.sendMail(mailOptions, (err) => {
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      },
    ],
    (err) => {
      if (err) return next(err);
      res.redirect('back');
    }
  );
});

router.get('/reset/:token', (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('back');
    }
    res.render('./auth/reset', { token: req.params.token });
  });
});

router.post('/reset/:token', (req, res) => {
  async.waterfall(
    [
      (done) => {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if (req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, (err) => {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;

              user.save((err) => {
                req.logIn(user, (err) => {
                  done(err, user);
                });
              });
            });
          } else {
            req.flash('error', 'Passwords do not match.');
            return res.redirect('back');
          }
        });
      },
      (user, done) => {
        const smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.GMAILUSER,
            pass: process.env.GMAILPASS,
          },
        });
        const mailOptions = {
          to: user.email,
          from: process.env.GMAILUSER,
          subject: 'Your password has been changed',
          text: `Hello,
          
          This is a confirmation that the password for your account ${user.email} ' has just been changed.
          `,
        };
        smtpTransport.sendMail(mailOptions, (err) => {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      },
    ],
    (err) => {
      res.redirect('/users/dashboard');
    }
  );
});

module.exports = router;
