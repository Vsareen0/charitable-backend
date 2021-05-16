// Get configuration
const config = require("config");
const fastify = require("fastify");
const swagger = require("./config/swagger");

require("make-promises-safe");
// Create an instance of fastify
const app = fastify({ ignoreTrailingSlash: true });

app.register(require("fastify-cors"), {
  origin: true,
  methods: "Get,PUT,POST,DELETE",
  allowHeaders: "Content-Type",
});

// Register Database with fastify
app
  .register(require("./config/db.js"), {
    name: config.get("DB.NAME"),
    username: config.get("DB.USERNAME"),
    password: config.get("DB.PASSWORD"),
  })
  .ready();

// Swagger for API Documentation
app.register(require("fastify-swagger"), swagger.options);

// Allow files
app.register(require("fastify-multipart"));

app.addContentTypeParser(
  "application/json",
  { parseAs: "string" },
  function (req, body, done) {
    try {
      var newBody = {
        raw: body,
        parsed: JSON.parse(body),
      };
      done(null, newBody);
    } catch (error) {
      error.statusCode = 400;
      done(error, undefined);
    }
  }
);

// Register routes
app.register(require("./src/routes/index"), { prefix: "/api/v1/" });
app.register(require("./src/routes/users"), { prefix: "/api/v1/users/" });
app.register(require("./src/routes/events"), { prefix: "/api/v1/events/" });
app.register(require("./src/routes/payments"), { prefix: "/api/v1/payments/" });

// Initialize the server
const PORT = config.get("APPLICATION.PORT");

const start = async () => {
  await app.listen(PORT);
  console.log(`Server listening on ${PORT}`);
};

start();
