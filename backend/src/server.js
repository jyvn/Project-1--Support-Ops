const express = require("express");
const {Pool} = require("pg");
const logger = require("./logger") 
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

//  create the pool using your config
const pool = new Pool(getDbConfig());

app.get("/health", async (req, res) => {
    const startTime = Date.now();  // Track how long this takes
    
    try {
        // Log that health check started
        logger.debug('Health check started');
        
        await pool.query("SELECT 1");
        
        const duration = Date.now() - startTime;
        
        // Log successful health check
        logger.debug('Health check passed', {
            duration_ms: duration,
            status: 'ok'
        });
        
        res.json({
            status: "ok",
            service: "supportops-backend",
            version: process.env.APP_VERSION || "dev",
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        const duration = Date.now() - startTime;
        
        // Log failed health check with ERROR level
        logger.error('Health check failed', {
            duration_ms: duration,
            error: error.message,
            code: error.code,
            stack: error.stack
        });
        
        res.status(503).json({
            status: "error",
            service: "supportops-backend",
            message: "Database connection failed",
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    // Use logger instead of console.log
    logger.info('Server started', {
        port: PORT,
        environment: process.env.NODE_ENV || 'development'
    });
});