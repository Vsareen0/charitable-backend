const EventsController = require("../controllers/events");
const EventSchema = require("../schemas/events");
const Payments = require("../models/payments");
const config = require("config");
const stripe = require("stripe")(config.get("STRIPE.SECRET_KEY"));

/*
 *     All the routes related to user, will be available below
 *
 */

module.exports = function (instance, opts, done) {
  const eventController = new EventsController();

  // Route to fetch all events.
  instance.get("/", {
    // Used to validate and serialize response and body
    schema: {
      description:
        "Find All events by pagination limited to  5 entries per page",
      tags: ["events"],
      summary: "Returns all the events",
    },
    // Handles the operation
    handler: eventController.findAll,
  });

  // Route to fetch all events.
  instance.get("/findBy", {
    // Used to validate and serialize response and body
    schema: {
      params: EventSchema.findByParamsOpts,
      description:
        "Find events by condition, pagination limited to  5 entries per page",
      tags: ["events"],
      summary: "Returns the events by condition",
    },
    // Handles the operation
    handler: eventController.findBy,
  });

  // Route to create event.
  instance.post("/", {
    // Used to validate and serialize response and body
    schema: {
      // body: EventSchema.createBodyOpts,
      // response: EventSchema.createResponseOpts,
      description: "Create an event",
      tags: ["events"],
      summary: "Create an event",
    },
    // Handles the operation
    handler: eventController.create,
  });

  // Route to create event.
  instance.post("/update", {
    // Used to validate and serialize response and body
    schema: {
      // body: EventSchema.createBodyOpts,
      // response: EventSchema.createResponseOpts,
      description: "Update an event",
      tags: ["events"],
      summary: "Update an event",
    },
    // Handles the operation
    handler: eventController.update,
  });

  // Route to upload image.
  instance.post("/upload/images", {
    // Used to validate and serialize response and body
    schema: {
      // body: EventSchema.createBodyOpts,
      // response: EventSchema.createResponseOpts,
      description: "Upload an image",
      tags: ["events"],
      summary: "Image Upload service",
    },
    // Handles the operation
    handler: eventController.imageUpload,
  });

  // Route to remove event, if exist.
  instance.delete("/", {
    schema: {
      body: EventSchema.deleteBodyOpts,
      response: EventSchema.deleteResponseOpts,
      description: "Delete an event",
      tags: ["events"],
      summary: "Delete the event",
    },
    handler: eventController.delete,
  });

  instance.post("/checkout-session", async (req, reply) => {
    try {
      const { _id, cause_name, image, amount = 100 } = req.body.parsed.data;
      const { email, _id: user_id } = req.headers;

      let updated_amount = amount * 100;
      const payment = await stripe.charges.create({
        amount: updated_amount,
        currency: "inr",
        source: "tok_amex",
        description: cause_name,
      });

      const session = await stripe.checkout.sessions.create({
        customer_email: email,
        submit_type: "donate",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: cause_name,
                images: [`${image}`],
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${config.get("DOMAIN.FRONTEND")}?success=true`,
        cancel_url: `${config.get("DOMAIN.FRONTEND")}?canceled=true`,
      });

      console.log("session: ", session);

      const newPayment = new Payments({
        user: user_id,
        event: _id,
        email,
        amount,
        payment_id: payment.id,
        payment_mode: `${(payment.source.funding, " ", payment.source.object)}`,
        description: cause_name,
        currency: payment.currency,
        status: payment.status,
        receipt_url: payment.receipt_url,
        payment_method: payment.payment_method,
        transaction_id: payment.balance_transaction,
        more_details: {
          outcome: payment.outcome,
          source: payment.source,
        },
      });

      const result = await newPayment.save();

      reply.code(200).send({ id: session.id, invoice: payment.receipt_url });
    } catch (ex) {
      console.log(ex);
      reply.code(400).send(ex);
    }
  });

  done();
};
