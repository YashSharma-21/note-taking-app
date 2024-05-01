const express = require("express");
const {Router} = express;
const noteRouter = new Router();
const clientPromise = require("../db-connectivity/mongo-client.js");

module.exports = noteRouter;
