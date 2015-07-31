#!/usr/bin/env node

/*
 * Tell the server to gracefully prepare for shutdown, but do not end the process.
 */

console.log("Instructing server to prepare for shutdown");

var http = require("http");

var options = {
  host: "localhost",
  port: 10080,
  path: "/prepareForShutdown",
  method: "HEAD"
};

var request = https.request(options, function(response) {
  console.log("Server completed preparations for shutdown");
});
request.end();
request.on("error", function(error) {
  throw error;
});
