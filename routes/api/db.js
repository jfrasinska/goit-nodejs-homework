const mongoose = require("mongoose");
require("dotenv").config();

const connectionString = process.env.MONGODB_CONNECTION_STRING;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("Database connection error:", error);
  process.exit(1);
});

db.once("open", () => {
  console.log("Database connection successful");
});

module.exports = db;
