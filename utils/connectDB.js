const mongoose = require('mongoose');

const DATABASEURL = process.env.DATABASEURL;

const InitiateMongoServer = async () => {
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
