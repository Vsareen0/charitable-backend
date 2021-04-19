const fp = require("fastify-plugin");
const mongoose = require("mongoose");

const mongo = (fastify, opts, done) => {
  mongoose.set("useUnifiedTopology", true);
  mongoose.set("useNewUrlParser", true);

  mongoose
    .connect(opts.url)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error(`Could not connect to MongoDB: ${err}`));

  done();
};

module.exports = fp(mongo);
