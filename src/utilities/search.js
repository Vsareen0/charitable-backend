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

module.exports = {
  eventsCondition,
};
