const mongoose = require("mongoose");
require("colors");

/*eslint-env node*/
const connectToDB = async (app) => {
  await mongoose
    .connect(`mongodb://localhost:27017/${process.env.DATABASE_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => {
      app.listen(
        process.env.PORT || 5000,
        console.log(
          `running on port `.blue.bold + `${process.env.PORT}`.yellow.bold
        )
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectToDB;
