const express = require("express");
const {Client} = require("pg");
const app = express();
const PORT = process.env.PORT || 3000;

function getDbConfig() {
    return {
        host: process.env.DB_HOST,
        port: Number(process.nextTick.DB_PORT || 5432),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    };
}
app.get("/health", async (req, res) => {
    // Check if the service is up with try function
    try{
        res.json ({
            status:"ok",
            service:"supportops-backend",
            version: process.env.APP_VERSION || "dev",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            status: "Error",
            service: "supportops-backend",
            error: "Database connection failed"
        });
    }
});

app.listen(PORT,() => {
    console.log(`[startup] supportops-backend listening on port ${PORT}`)
});