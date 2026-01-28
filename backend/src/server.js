const express = require("express");
const {Pool} = require("pg");  
const app = express();
const PORT = process.env.PORT || 3000;

function getDbConfig() {
    return {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 5432),  
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    };
}

//  NEW: Actually create the pool using your config
const pool = new Pool(getDbConfig());

app.get("/health", async (req, res) => {
    try {
        // ✅ NEW: Actually check the database before saying "ok"
        await pool.query("SELECT 1");
        
        res.json({
            status: "ok",
            service: "supportops-backend",
            version: process.env.APP_VERSION || "dev",
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(503).json({
            status: "error",  // lowercase for consistency
            service: "supportops-backend",
            message: "Database connection failed",
            error: error.message  // Show what actually went wrong
        });
    }
});

app.listen(PORT, () => {
    console.log(`[startup] supportops-backend listening on port ${PORT}`);
});