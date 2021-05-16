const config = require("config");
const dayjs = require("dayjs");
const mongoose = require("mongoose");
const Event = require("../models/events");
const Payments = require("../models/payments");
const { uploadFile } = require("../utilities/aws");
const paginate = require("../utilities/pagination");
const { eventsCondition } = require("../utilities/search");
const stripe = require("stripe")(config.get("STRIPE.SECRET_KEY"));
const _ = require("lodash");

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
    const totals = await Payments.aggregate([
      {
        $group: {
          _id: "$event",
          raised: {
            $sum: "$amount",
          },
        },
      },
    ]);

    reply.code(200).send({ events, totals });
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

    // let { page = 1 } = req.query;

    // // Get count of all events found by condition
    // const count = await Event.count(eventsCondition(req.query));

    console.log("query: ", req.query);

    /* Pagination */
    // const { canPaginate, limit, offset, maxPages } = paginate(count, page, 5);

    // if (!canPaginate) {
    //   reply.send({
    //     statusCode: 200,
    //     message: `The page you are trying to go doesn\'t exist, Make sure the page you are trying to reach is in range 1-${maxPages}`,
    //   });
    // }
    /** Pagination ends here */
    const res = await Event.find(eventsCondition(req.query));
    let raised = null;
    if (req.query._id) {
      // raised = await Payments.aggregate([
      //   {
      //     $match: {
      //       event: req.query._id,
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: "$event",
      //       raised: {
      //         $sum: "$amount",
      //       },
      //     },
      //   },
      // ]);

      raised = await Payments.aggregate([
        {
          $match: {
            event: mongoose.Types.ObjectId(req.query._id),
          },
        },
        {
          $group: {
            _id: "$event",
            raised: {
              $sum: "$amount",
            },
          },
        },
      ]);
    }
    // .skip(offset)
    // .limit(limit);
    console.log(raised);
    reply.code(200).send({
      events: res,
      raised: raised ? raised[0] : null,
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

    try {
      const { username } = req.headers;
      console.log("events: ", req.body);
      const {
        name,
        email,
        phone,
        cause_name,
        cause_type,
        target_price,
        description,
        city,
        state,
        postal_code,
        country,
        image = [],
      } = req.body.parsed;

      const data = {
        cause_name,
        cause_type,
        target_price,
        description,
        location: { city, state, postal_code, country },
        creator: { name, email, phone },
      };

      let BASE_IMG_URL = "https://charitable-crowdfunding.s3.amazonaws.com";
      let NUMBER = Math.round(Math.random() * 4 + 1);
      let img =
        image.length > 0
          ? `${BASE_IMG_URL}/${username}/${image[0].name}`
          : `${BASE_IMG_URL}/random-${NUMBER}.svg`;

      const event = new Event({
        ...data,
        image: img,
      });

      await event.save();

      reply.code(200).send(event);
    } catch (ex) {
      console.error(ex);
    }
  };

  update = async (req, reply) => {
    // Validate the response and body of route, helps achieve higher throughput
    // if pre-initialzed
    // if (req.validationError) {
    //   reply.code(400).send(req.validationError);
    // }
    try {
      let data = _.omit(req.body.parsed, ["_id", "__v"]);
      const event = await Event.updateOne(
        {
          _id: mongoose.Types.ObjectId(req.body.parsed._id),
        },
        {
          ...data,
        }
      );

      reply.code(202).send({ event, message: "Event updated successfully !" });
    } catch (ex) {
      console.log(ex);
    }
  };

  imageUpload = async (req, reply) => {
    const file = await req.file();
    const username = await req.headers["user_name"];
    const res = await uploadFile(username, file);

    return reply.code(200).send(res);
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

    const { id, name } = req.body.parsed;
    const res = await Event.findByIdAndDelete({
      _id: id,
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
    const { email, shipping, amount } = req.body.parsed;
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
