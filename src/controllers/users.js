const User = require("../models/user");
const dayjs = require("dayjs");
/**
 *      UserController -
 *
 *      All the CRUD operations are handled here only
 *      Only functions are available through which
 *      we will create interfaces
 *
 */
class UserController {
  constructor() {
    // Initialized necessary plugins
    this.dayjs = dayjs();
  }

  // Create or update user
  createOrUpdate = async (req, reply) => {
    // Validate the response and body of route, helps achieve higher throughput
    // if pre-initialzed
    if (req.validationError) {
      reply.code(400).send(req.validationError);
    }

    const user = await User.findOne({
      email: req.body.email,
    });

    if (user != null) {
      reply.code(200).send({
        statusCode: 200,
        data: user,
        message: "User profile exists ! ",
      });
    } else {
      const res = new User({
        ...req.body,
      });

      await res.save();

      reply.code(200).send({
        statusCode: 200,
        data: res,
        message: "User profile created ! ",
      });
    }
  };

  /**
   *
   *    Delete User
   *
   **/
  delete = async (req, reply) => {
    if (req.validationError) {
      reply.code(400).send(req.validationError);
    }

    const { username } = req.body;
    const res = await User.deleteOne({
      username,
    });

    if (res.deletedCount == 0) {
      reply.code(202).send({ message: `No profile found for ${username}` });
    }
    reply.code(202).send({ message: `Removed ${username} profile !` });
  };
}

module.exports = UserController;
