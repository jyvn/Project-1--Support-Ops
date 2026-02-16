const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errotrs({stack: true}),
        winston.format.json()
    ),
    defaultMeta: {
        service: 'supportops-backend',
        version: process.env.APP_VERSION || 'dev'
    },
    transports: [
        // what you see in docker
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple() //readable format
            )
        })
    ]
});

module.exports = logger;