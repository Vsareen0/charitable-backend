const eventsProperties = {
  properties: {
    name: { type: "string" },
    description: { type: "number" },
    created_by: { type: "number" },
    sponsored_by: { type: "number" },
    location: {
      type: "object",
      properties: {
        city: { type: "string" },
        state: { type: "string" },
        country: { type: "string" },
      },
    },
  },
};

exports.createResponseOpts = {
  "2xx": {
    type: "object",
    properties: {
      message: { type: "string" },
      data: { type: "object" },
    },
  },
};

exports.createBodyOpts = {
  type: "object",
  eventsProperties,
  required: ["name", "description", "created_by", "sponsored_by", "location"],
};

exports.deleteBodyOpts = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
  },
};

exports.deleteResponseOpts = {
  "2xx": {
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
};

// exports.findByParamsOpts = {
//   type: "object",
//   properties: {
//     movie_id: { type: "number" },
//     title: { type: "string" },
//     release_date: { type: "string" },
//     distributor: { type: "string" },
//     genre: { type: "string" },
//     director: { type: "string" },
//     imdb_rating: { type: "number" },
//     page: { type: "number" },
//   },
// };
