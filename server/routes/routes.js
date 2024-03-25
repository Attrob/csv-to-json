const express = require("express");
const app = express.Router();
const { csv_to_json } = require("../core/core");

app.route("/v1/csv-to-json")
.post(csv_to_json);

module.exports = app;