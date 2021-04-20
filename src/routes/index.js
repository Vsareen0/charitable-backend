const IndexController = require("../controllers/index");
const { indexOpts } = require("../schemas/index");

module.exports = function (instance, opts, done) {
  // Home Page
  instance.get(
    "/",
    {
      schema: {
        response: indexOpts,
        description: "Home route",
        tags: ["index"],
        summary: "Home route that checks server connection",
      },
    },
    IndexController.home
  );

  done();
};
