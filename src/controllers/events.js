const Event = require("../models/events");
const dayjs = require("dayjs");
const paginate = require("../utilities/pagination");
const { eventsCondition } = require("../utilities/search");
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
}

module.exports = EventsController;
