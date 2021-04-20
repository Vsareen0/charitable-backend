const PaymentsController = require("../controllers/payments");
const PaymentSchema = require("../schemas/payments");

/*
 *     All the routes related to payments, will be available below
 *
 */

module.exports = function (instance, opts, done) {
  const paymentsController = new PaymentsController();

  // Route to fetch all payments.
  instance.get("/", {
    // Used to validate and serialize response and body
    schema: {},
    // Handles the operation
    handler: paymentsController.findAll,
  });

  // Route to fetch all paymentss.
  instance.get("/findBy", {
    // Used to validate and serialize response and body
    schema: {
      params: PaymentSchema.findByParamsOpts,
    },
    // Handles the operation
    handler: paymentsController.findBy,
  });

  // Route to payment.
  instance.post("/:id", {
    // Used to validate and serialize response and body
    schema: {},
    // Handles the operation
    handler: paymentsController.create,
  });

  // Route to remove payments, if exist.
  instance.delete("/", {
    schema: {
      body: PaymentSchema.deleteBodyOpts,
      response: PaymentSchema.deleteResponseOpts,
    },
    handler: paymentsController.delete,
  });

  done();
};
