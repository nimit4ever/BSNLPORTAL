const ejs = require('ejs');
const path = require('path');
const moment = require('moment');
const nodemailer = require('nodemailer');

const { Feasibility } = require('../../models/feasibilities');
const { User } = require('../../models/users');

async function feasibilityMail(id, agencyEmail = '', ownerEmail = '') {
  await Feasibility.findById(id)
    .populate('itemList')
    .exec(async (err, feasibility) => {
      if (err || !feasibility) {
        throw err;
      } else {
        feasibility.estimate = feasibility.itemList
          .reduce((comm, item) => {
            return (comm += item.amt);
          }, 0)
          .toFixed(2);

        await feasibility.save();
        const feasibiliyOwnwer = await User.findOne({ username: feasibility.createBy });
        if (feasibiliyOwnwer) {
          ownerEmail = feasibiliyOwnwer.email;
        }
        ejs.renderFile(path.join(__dirname, '../../views/feasibilities/mailSubmit.ejs'), { feasibility, moment }, (err, data) => {
          if (err) {
            throw err;
          } else {
            const smtpTransport = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                user: process.env.GMAILUSER,
                pass: process.env.GMAILPASS,
              },
            });
            const mailOptions = {
              to: ownerEmail,
              cc: agencyEmail,
              from: process.env.GMAILUSER,
              subject: `BSNL Portal Feasibility Report of ${feasibility.name} by ID: ${feasibility._id}`,
              html: data,
            };

            smtpTransport.sendMail(mailOptions, (err, info) => {
              if (err) console.log(err);
            });
          }
        });
      }
    });
}

module.exports = { feasibilityMail };
