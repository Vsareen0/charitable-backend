const EventsController = require("../controllers/events");
const EventSchema = require("../schemas/events");

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
      body: EventSchema.createBodyOpts,
      response: EventSchema.createResponseOpts,
      description: "Create an event",
      tags: ["events"],
      summary: "Create an event",
    },
    // Handles the operation
    handler: eventController.create,
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

  done();
};
