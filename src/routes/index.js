const IndexController = require("../controllers/index");
const Event = require("../models/events");
const Payment = require("../models/payments");
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

  instance.get("/home", async (req, reply) => {
    const raised = await Payment.aggregate([
      {
        $group: {
          _id: null,
          total_amount: { $sum: "$amount" },
        },
      },
    ]);

    const donations = await Payment.count();
    const fundraisers = await Event.count();

    reply.code(200).send({ raised, donations, fundraisers });
  });

  done();
};
