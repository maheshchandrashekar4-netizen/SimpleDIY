const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");
const app = express();

app.use(bodyParser.json());
app.use(express.static("public")); // serve UI

// ----------------------------
// Root
// ----------------------------
app.get("/", (req, res) => {
    res.send("Simple Custom Activity Running");
});

// ----------------------------
// Return config.json
// ----------------------------
app.get("/config.json", (req, res) => {
    res.sendFile(path.join(__dirname, "config.json"));
});

// ----------------------------
// JOURNEY BUILDER Lifecycle
// ----------------------------
app.post("/save", (req, res) => res.json({ status: "ok" }));
app.post("/validate", (req, res) => res.json({ status: "ok" }));
app.post("/publish", (req, res) => res.json({ status: "ok" }));
app.post("/stop", (req, res) => res.json({ status: "ok" }));

// ----------------------------
// EXECUTE: UPDATE DE
// ----------------------------
app.post("/execute", async (req, res) => {
    try {
        console.log("EXECUTE called");

        const tokenResp = await axios.post(
            `${process.env.SFMC_AUTH_BASE}/v2/token`,
            {
                grant_type: "client_credentials",
                client_id: process.env.SFMC_CLIENT_ID,
                client_secret: process.env.SFMC_CLIENT_SECRET
            }
        );

        const token = tokenResp.data.access_token;

        const rowData = {
            keys: { Email: "test@example.com" },  // primary key in DE
            values: { Status: "Completed" }        // static update
        };

        await axios.put(
            `${process.env.SFMC_REST_BASE}/hub/v1/dataevents/key:${process.env.DE_KEY}/rowset`,
            [rowData],
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({ status: "row updated" });

    } catch (err) {
        console.error(err.response?.data || err);
        res.status(500).json({ error: true });
    }
});

// ----------------------------
// Start server
// ----------------------------
app.listen(3000, () => console.log("Server started on port 3000"));
