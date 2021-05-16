const commonProperties = {
  properties: {
    first_name: { type: "string" },
    last_name: { type: "string" },
    password: { type: "string" },
    mobile: { type: "string" },
    email: { type: "string" },
    dob: { type: "string" },
    username: { type: "string" },
    added_on: { type: "string" },
    modified_on: { type: "string" },
    linux_added_on: { type: "integer" },
    linux_modified_on: { type: "integer" },
  },
};

exports.createResponseOpts = {
  "2xx": {
    type: "object",
    properties: {
      message: { type: "string" },
      data: {
        type: "object",
        commonProperties,
      },
    },
    required: ["message", "data"],
  },
};

exports.createBodyOpts = {
  type: "object",
  properties: {
    first_name: { type: "string" },
    last_name: { type: "string" },
    password: { type: "string" },
    mobile: { type: "string" },
    email: { type: "string" },
    dob: { type: "string" },
    username: { type: "string" },
    added_on: { type: "string" },
    modified_on: { type: "string" },
    linux_added_on: { type: "integer" },
    linux_modified_on: { type: "integer" },
  },
  // required: [
  //   "first_name",
  //   "last_name",
  //   "password",
  //   "mobile",
  //   "email",
  //   "dob",
  //   "username",
  //   "added_on",
  //   "modified_on",
  //   "linux_added_on",
  //   "linux_modified_on",
  // ],
};

exports.deleteResponseOpts = {
  "2xx": {
    type: "object",
    properties: {
      message: { type: "string" },
    },
    required: ["message"],
  },
};

exports.deleteBodyOpts = {
  type: "object",
  properties: {
    username: { type: "string" },
  },
  required: ["username"],
};
