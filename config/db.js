const fp = require("fastify-plugin");
const mongoose = require("mongoose");

const mongo = (fastify, opts, done) => {
  // mongoose.set("debug", true);
  mongoose.set("useUnifiedTopology", true);
  mongoose.set("useNewUrlParser", true);

  const { username, password, name } = opts;
  mongoose
    .connect(
      `mongodb+srv://${username}:${password}@cluster0.b0khy.mongodb.net/${name}`
    )
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error(`Could not connect to MongoDB: ${err}`));

  done();
};

module.exports = fp(mongo);
