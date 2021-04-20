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
    schema: {},
    // Handles the operation
    handler: eventController.findAll,
  });

  // Route to fetch all events.
  instance.get("/findBy", {
    // Used to validate and serialize response and body
    schema: {
      params: EventSchema.findByParamsOpts,
    },
    // Handles the operation
    handler: eventController.findBy,
  });

  // Route to check if user exist update his/her profile, otherwise create.
  instance.post("/", {
    // Used to validate and serialize response and body
    schema: {
      body: EventSchema.createBodyOpts,
      response: EventSchema.createResponseOpts,
    },
    // Handles the operation
    handler: eventController.create,
  });

  // Route to remove event, if exist.
  instance.delete("/", {
    schema: {
      body: EventSchema.deleteBodyOpts,
      response: EventSchema.deleteResponseOpts,
    },
    handler: eventController.delete,
  });

  done();
};
