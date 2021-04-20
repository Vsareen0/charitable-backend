const paymentProperties = {
  properties: {
    email: { type: "string" },
    amount: { type: "number" },
    shipping: {
      type: "object",
      properties: {
        name: { type: "string" },
        address: {
          type: "object",
          properties: {
            city: { type: "string" },
            state: { type: "string" },
            country: { type: "string" },
            line1: { type: "string" },
            postal_code: { type: "string" },
          },
        },
      },
    },
  },
};

exports.createBodyOpts = {
  type: "object",
  paymentProperties,
};

exports.createResponseOpts = {
  "2xx": {
    type: "object",
    properties: {
      message: { type: "string" },
      payment: { type: "object" },
    },
  },
};

exports.deleteBodyOpts = {
  type: "object",
  properties: {
    id: { type: "string" },
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
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
    payment_code: { type: "string" },
    email: { type: "string" },
    amount: { type: "string" },
    payment_id: { type: "string" },
    status: { type: "string" },
  },
};
