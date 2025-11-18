const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(express.static("public")); // serves ui.html & icon.png

// ------------------------------
// Root
// ------------------------------
app.get("/", (req, res) => {
    res.send("Simple Custom Activity Running");
});

// ------------------------------
// Return config.json for SFMC
// ------------------------------
app.get("/config.json", (req, res) => {
    res.sendFile(path.join(__dirname, "config.json"));
});

// ------------------------------
// Journey Builder lifecycle
// ------------------------------
app.post("/save", (req, res) => res.json({ status: "ok" }));
app.post("/validate", (req, res) => res.json({ status: "ok" }));
app.post("/publish", (req, res) => res.json({ status: "ok" }));
app.post("/stop", (req, res) => res.json({ status: "ok" }));

// ------------------------------
// EXECUTE — updates a DE
// ------------------------------
app.post("/execute", async (req, res) => {
    try {
        console.log("🚀 EXECUTE called");

        // 1. Auth
        const tokenResp = await axios.post(
            `${process.env.SFMC_AUTH_BASE}/v2/token`,
            {
                grant_type: "client_credentials",
                client_id: process.env.SFMC_CLIENT_ID,
                client_secret: process.env.SFMC_CLIENT_SECRET
            }
        );

        const token = tokenResp.data.access_token;

        // 2. Row update payload
        const row = {
            keys: { Email: "test@example.com" },   // change if needed
            values: { Status: "Completed" }
        };

        // 3. Send update to DE
        await axios.put(
            `${process.env.SFMC_REST_BASE}/hub/v1/dataevents/key:${process.env.DE_KEY}/rowset`,
            [row],
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({ status: "DE updated successfully" });

    } catch (err) {
        console.error("❌ EXECUTE ERROR", err.response?.data || err);
        res.status(500).json({ error: true });
    }
});

// ------------------------------
// Start Server
// ------------------------------
app.listen(3000, () => console.log("Server started on port 3000"));
