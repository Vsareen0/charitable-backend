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

exports.findByParamsOpts = {
  type: "object",
  properties: {
    name: { type: "number" },
    created_by: { type: "string" },
    sponsored_by: { type: "array" },
    location: { type: "string" },
  },
};
