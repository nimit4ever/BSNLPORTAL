const Joi = require('joi');
const nodemailer = require('nodemailer');

const { Order } = require('../../models/orders');

async function orderMail({ data, email }) {
  const schema = Joi.object({
    email: Joi.string().email().required().label('Email'),
  });

  const { error } = await schema.validate({ email });
  if (error) {
    throw error.message;
  } else {
    const smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAILUSER,
        pass: process.env.GMAILPASS,
      },
    });
    const mailOptions = {
      to: email,
      from: process.env.GMAILUSER,
      subject: `BSNL Leased Line Order`,
      html: data,
    };

    await smtpTransport
      .sendMail(mailOptions)
      .then(function (error, info) {
        if (error) {
          throw error;
        } else {
          console.log(`Message sent: ${info.response}`);
        }
      })
      .catch(function (error) {
        error.message = 'Can not connect to mail server';
        throw error;
      });
  }
}

module.exports = { orderMail };
