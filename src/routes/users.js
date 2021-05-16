const UserController = require("../controllers/users");
const UserSchema = require("../schemas/users");

/*
 *     All the routes related to user, will be available below
 *
 */

module.exports = function (instance, opts, done) {
  const userController = new UserController();

  instance.get("/", {
    schema: {
      description: "Get users ",
      tags: ["users"],
      summary: "Get users",
    },
    handler: userController.get,
  });

  instance.post("/authenticate", {
    schema: {
      description: "Authenticate User ",
      tags: ["users"],
      summary: "Authenticate users",
    },
    handler: userController.auth,
  });

  // Route to check if user exist update his/her profile, otherwise create.
  instance.post("/", {
    // Used to validate and serialize response and body
    schema: {
      body: UserSchema.createBodyOpts,
      response: UserSchema.createResponseOpts,
      description: "Create a user ",
      tags: ["users"],
      summary: "Create a user",
    },
    // Handles the operation
    handler: userController.create,
  });

  instance.post("/update", {
    // Used to validate and serialize response and body
    schema: {
      description: "Update a user ",
      tags: ["users"],
      summary: "Update a user",
    },
    // Handles the operation
    handler: userController.update,
  });

  // Route to remove user, if exist.
  instance.delete("/", {
    schema: {
      body: UserSchema.deleteBodyOpts,
      response: UserSchema.deleteResponseOpts,
      description: "Delete a User",
      tags: ["users"],
      summary: "Delete Users",
    },
    handler: userController.delete,
  });

  done();
};
