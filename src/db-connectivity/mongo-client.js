const {MongoClient} = require("mongodb");
const ip = "localhost",port = 27017;
const clientPromise = MongoClient.connect(`mongodb://${ip}:${port}`);

module.exports = clientPromise;