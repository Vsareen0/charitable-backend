const Event = require("../models/events");
const dayjs = require("dayjs");
const mongoose = require("mongoose");
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

  //   Get Events
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

  // Create Event
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

    console.log("====================================");
    console.log(res);
    console.log("====================================");

    if (res == null) {
      reply.code(202).send({ message: `No event found for ${name}` });
    }
    reply.code(202).send({ message: `${name} has been removed !` });
  };
}

module.exports = EventsController;
