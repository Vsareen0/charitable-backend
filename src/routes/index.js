const IndexController = require("../controllers/index");
const { indexOpts } = require("../schemas/index");

module.exports = function (instance, opts, done) {
  // Home Page
  instance.get("/", indexOpts, IndexController.home);

  done();
};
