let daysjs = require("dayjs");
let mongoose = require("mongoose");

const eventsCondition = (fields) => {
  let {
    name = null,
    created_by = null,
    sponsored_by = null,
    location = null,
  } = fields;

  return {
    $and: [
      name != null
        ? {
            name: { $regex: `.*${name}*.` },
          }
        : {},
      created_by != null
        ? {
            created_by: { $regex: `.*${created_by}*.` },
          }
        : {},
      sponsored_by != null
        ? {
            sponsored_by: { $regex: `.*${sponsored_by}*.` },
          }
        : {},
      location != null
        ? {
            $or: [
              { "location.city": { $regex: `.*${location}*.` } },
              { "location.name": { $regex: `.*${location}*.` } },
              { "location.country": { $regex: `.*${location}*.` } },
            ],
          }
        : {},
    ],
  };
};

const paymentsCondition = (fields) => {
  let {
    id = null,
    email = null,
    createdAt = null,
    updatedAt = null,
    payment_mode = null,
    amount = null,
    payment_id = null,
    status = null,
  } = fields;

  let max_one_day_limit_created = null;
  let min_one_day_limit_created = null;
  let max_one_day_limit_updated = null;
  let min_one_day_limit_updated = null;

  if (createdAt != null) {
    max_one_day_limit_created = daysjs(createdAt).add(1, "day");
    min_one_day_limit_created = daysjs(createdAt).add(1, "day");
  }
  if (updatedAt != null) {
    max_one_day_limit_updated = daysjs(updatedAt).add(1, "day");
    min_one_day_limit_updated = daysjs(updatedAt).add(1, "day");
  }

  return {
    $and: [
      email != null
        ? {
            email: { $regex: `.*${email}*.` },
          }
        : {},
      payment_mode != null
        ? {
            payment_mode: { $regex: `.*${payment_mode}*.` },
          }
        : {},
      status != null
        ? {
            status: { $regex: `.*${status}*.` },
          }
        : {},
      payment_id != null
        ? {
            payment_id: { $regex: `.*${payment_id}*.` },
          }
        : {},
      createdAt != null
        ? {
            createdAt: {
              $lte: max_one_day_limit_created,
              $gte: min_one_day_limit_created,
            },
          }
        : {},
      updatedAt != null
        ? {
            updatedAt: {
              $lte: max_one_day_limit_updated,
              $gte: min_one_day_limit_updated,
            },
          }
        : {},
      amount != null
        ? {
            amount: { $gte: amount },
          }
        : {},
    ],
  };
};

module.exports = {
  eventsCondition,
  paymentsCondition,
};
