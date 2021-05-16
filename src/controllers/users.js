const User = require("../models/user");
const dayjs = require("dayjs");
const _ = require("lodash");
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

  auth = async (req, reply) => {
    console.log(req.body);
    const { username, password } = req.body.parsed;

    const res = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (res != null) {
      let user = _.pick(res, [
        "username",
        "mobile",
        "first_name",
        "last_name",
        "dob",
        "email",
        "password",
        "_id",
      ]);
      const token = await res.authenticate(user, username, password);
      if (token) {
        reply.code(200).send({ user, token, message: "Login Successful" });
      } else {
        reply.code(400).send({ message: "Invalid Credentials.", data: result });
      }
    } else {
      reply.code(400).send({ message: "Invalid Credentials.", data: result });
    }
  };

  get = async (req, reply) => {
    const user = await User.find();
    reply.code(200).send(user);
  };

  // Create or update user
  create = async (req, reply) => {
    // Validate the response and body of route, helps achieve higher throughput
    // if pre-initialzed
    if (req.validationError) {
      reply.code(400).send(req.validationError);
    }

    const check_email = await User.findOne({
      email: req.body.parsed.email,
    });

    const check_username = await User.findOne({
      username: req.body.parsed.username,
    });

    if (check_email != null) {
      reply.code(201).send({
        statusCode: 201,
        data: check_email,
        message: "Account already associated with this email.",
      });
    } else if (check_username != null) {
      reply.code(201).send({
        statusCode: 201,
        data: check_username,
        message: "Username taken.",
      });
    } else {
      const res = new User({
        ...req.body.parsed,
      });

      await res.save();

      reply.code(200).send({
        statusCode: 200,
        data: res,
        message: "User profile created ! ",
      });
    }
  };

  // Create or update user
  update = async (req, reply) => {
    // Validate the response and body of route, helps achieve higher throughput
    // if pre-initialzed
    if (req.validationError) {
      reply.code(400).send(req.validationError);
    }

    const check_username = await User.findOne({
      username: req.body.parsed.username,
    });

    console.log(check_username, " ", req.body.parsed);

    if (check_username != null) {
      const user = await User.updateOne(
        {
          username: check_username.username,
        },
        {
          ...req.body.parsed,
        }
      );

      reply.code(202).send({ user, message: "Profile Updated successfully !" });
    }

    reply.code(404).send({ message: "Not found !" });
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
