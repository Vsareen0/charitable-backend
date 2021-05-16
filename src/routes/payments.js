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
    schema: {
      description: "Get all payments limited to 5 entries per page",
      tags: ["payments"],
      summary: "Get all payments",
    },
    // Handles the operation
    handler: paymentsController.findAll,
  });

  // Route to fetch all paymentss.
  instance.get("/findBy", {
    // Used to validate and serialize response and body
    schema: {
      params: PaymentSchema.findByParamsOpts,
      description: "Get payments by condition limited to 5 entries per page",
      tags: ["payments"],
      summary: "Find payments by condition",
    },
    // Handles the operation
    handler: paymentsController.findBy,
  });

  // Route to payment.
  instance.post("/", {
    // Used to validate and serialize response and body
    schema: {
      body: PaymentSchema.createBodyOpts,
      description: "Create a payment",
      tags: ["payments"],
      summary: "Create payment",
    },
    // Handles the operation
    handler: paymentsController.create,
  });

  // Route to remove payments, if exist.
  instance.delete("/", {
    schema: {
      body: PaymentSchema.deleteBodyOpts,
      response: PaymentSchema.deleteResponseOpts,
      description: "Delete payment by id",
      tags: ["payments"],
      summary: "Deletes payment",
    },
    handler: paymentsController.delete,
  });

  done();
};
