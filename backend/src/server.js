const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/health", async (req, res) => {
    // Check if the service is up
    res.json ({
        status:"ok",
        service:"supportops-backedn",
        version: process.env.APP_VERSION || "dev",
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT,() => {
    console.log(`[startup] supportops-backend listening on port ${PORT}`)
});