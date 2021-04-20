const config = require("config");
const dayjs = require("dayjs");
const Event = require("../models/events");
const Payments = require("../models/payments");
const paginate = require("../utilities/pagination");
const { eventsCondition } = require("../utilities/search");
const stripe = require("stripe")(config.get("STRIPE.SECRET_KEY"));
/**
 *      EventsController -
 *
 *      All the CRUD operations are handled here only
 *      Only functions are available through which
 *      we will create interfaces
 *
 */
class EventsController {
  constructor() {
    // Initialized necessary plugins
    this.dayjs = dayjs();
  }

  /**
   *
   * Return all events
   *
   *
   * @param {*} req
   * @param {statusCode, data, message} reply
   */
  findAll = async (req, reply) => {
    if (req.validationError) {
      reply.code(400).send(req.validationError);
    }

    const events = await Event.find();
    reply.code(200).send({
      statusCode: 200,
      data: events,
      message: `${
        events.length >= 1 ? "List of event" : "No Events created yet."
      }`,
    });
  };

  /**
   *
   * Get Events By conditions
   *
   * @param {name, created_by, location, sponsored_by } req
   * @param {statusCode, data, message} reply
   *
   *
   */
  findBy = async (req, reply) => {
    if (req.validationError) {
      reply.code(400).send(req.validationError);
    }

    let { page = 1 } = req.query;

    // Get count of all events found by condition
    const count = await Event.count(eventsCondition(req.query));

    console.log(count);

    /* Pagination */
    const { canPaginate, limit, offset, maxPages } = paginate(count, page, 5);

    if (!canPaginate) {
      reply.send({
        statusCode: 200,
        message: `The page you are trying to go doesn\'t exist, Make sure the page you are trying to reach is in range 1-${maxPages}`,
      });
    }
    /** Pagination ends here */

    const res = await Event.find(eventsCondition(req.query))
      .skip(offset)
      .limit(limit);

    reply.send({
      statusCode: 200,
      data: {
        events: res,
        length: count,
        currPage: page,
        totalPages: maxPages,
      },
      message: `Total ${count} movies found, ${res.length} movie found on page no. ${page}`,
    });
  };

  /**
   *
   * Create Event
   *
   *
   * @param {*} req
   * @param {statusCode, message, data} reply
   */
  create = async (req, reply) => {
    // Validate the response and body of route, helps achieve higher throughput
    // if pre-initialzed
    if (req.validationError) {
      reply.code(400).send(req.validationError);
    }

    const res = new Event({
      ...req.body,
    });

    await res.save();

    reply.code(200).send({
      statusCode: 200,
      data: res,
      message: `Event named \"${req.body.name}\" has been created ! `,
    });
  };

  /**
   *
   *    Delete Event
   *
   **/
  delete = async (req, reply) => {
    if (req.validationError) {
      reply.code(400).send(req.validationError);
    }

    const { _id, name } = req.body;
    const res = await Event.findByIdAndDelete({
      _id,
    });

    if (res == null) {
      reply.code(202).send({ message: `No event found for ${name}` });
    }
    reply.code(202).send({ message: `${name} has been removed !` });
  };

  /**
   *
   * Payment functionality for Events
   *
   *
   * @param {*} req
   * @param {*} reply
   */
  payment = async (req, reply) => {
    if (req.validationError) {
      reply.code(400).send(req.validationError);
    }
    const { user_id } = req.headers;
    const { event_id } = req.query;
    const { email, shipping, amount } = req.body;
    const description = `Payment By ${user_id} for event ${event_id}`;

    let re_calculated_amount = amount * 100;
    const token = await stripe.tokens.create({
      card: {
        number: "4242424242424242",
        exp_month: 4,
        exp_year: 2022,
        cvc: "314",
      },
    });

    const customer = await stripe.customers.create({
      email,
      source: token.id,
      ...shipping,
    });

    const payment = await stripe.charges.create({
      amount: re_calculated_amount,
      currency: "inr",
      description,
      customer: customer.id,
    });

    const newPayment = new Payments({
      user: user_id,
      event: event_id,
      email,
      amount,
      payment_id: payment.id,
      payment_mode: `${(payment.source.funding, " ", payment.source.object)}`,
      description,
      currency: payment.currency,
      customer: payment.customer,
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
    console.log(result);

    reply.send({ payment, message: "success" });
  };
}

module.exports = EventsController;
