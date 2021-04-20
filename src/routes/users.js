const UserController = require("../controllers/users");
const UserSchema = require("../schemas/users");

/*
 *     All the routes related to user, will be available below
 *
 */

module.exports = function (instance, opts, done) {
  const userController = new UserController();

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
