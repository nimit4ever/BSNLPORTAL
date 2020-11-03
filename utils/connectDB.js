const mongoose = require('mongoose');

const InitiateMongoServer = async (local) => {
  let DATABASEURL = '';
  if (local) {
    DATABASEURL = 'mongodb://localhost:27017/lcreport';
  } else {
    DATABASEURL = process.env.DATABASEURL;
  }

  try {
    await mongoose.connect(DATABASEURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log('Now connected to MongoDB!');
  } catch (err) {
    console.log(`Database connection error: ${err.message}`);
    throw err;
  }
};

module.exports = InitiateMongoServer;
