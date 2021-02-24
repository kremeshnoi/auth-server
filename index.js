const http = require("http");
const redis = require("ioredis");
const express = require("express");
const bodyParser = require("body-parser");

const client = redis.createClient({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
});

client.on("connect", () => {
  console.log("redis connected");
});

const { routes } = require("./app/routes");

const app = express();
app.use(bodyParser.json());

routes.forEach((item) => {
  app.use(`/api/v1/${ item }`, require(`./app/routes/${ item }`));
});

console.log("server works");

http.createServer({}, app).listen(3000);

module.exports = client;