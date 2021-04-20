// Get configuration
const config = require("config");
const fastify = require("fastify");
require("make-promises-safe");
// Create an instance of fastify
const app = fastify({ ignoreTrailingSlash: true });

// Register Database with fastify
app
  .register(require("./config/db.js"), {
    name: config.get("DB.NAME"),
    username: config.get("DB.USERNAME"),
    password: config.get("DB.PASSWORD"),
  })
  .ready();

// Register routes
app.register(require("./src/routes/index"), { prefix: "/api/v1/" });
app.register(require("./src/routes/events"), { prefix: "/api/v1/events/" });
app.register(require("./src/routes/users"), { prefix: "/api/v1/users/" });

// Initialize the server
const PORT = config.get("APPLICATION.PORT");

const start = async () => {
  await app.listen(PORT);
  console.log(`Server listening on ${PORT}`);
};

start();
