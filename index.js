const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

/* Prevent caching */
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

/* CONFIG */
app.get("/config.json", (req, res) => {
  res.sendFile(__dirname + "/config.json");
});

/* EXECUTE */
app.post("/execute", (req, res) => {

  console.log("==== JOURNEY ENTRY LOG ====");

  const data = req.body.inArguments[0];

  console.log("SubscriberKey:", data.SubscriberKey);
  console.log("Email:", data.Email);
  console.log("JourneyId:", data.JourneyId);
  console.log("JourneyName:", data.JourneyName);
  console.log("Timestamp:", new Date().toISOString());

  console.log("==========================");

  res.status(200).send({
    branchResult: "next"
  });
});

/* REQUIRED ENDPOINTS */
app.post("/publish", (req, res) => {
  console.log("PUBLISH CALLED");
  res.status(200).send({});
});

app.post("/validate", (req, res) => {
  console.log("VALIDATE CALLED");
  res.status(200).send({ valid: true });
});

app.post("/stop", (req, res) => {
  console.log("STOP CALLED");
  res.status(200).send({});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
