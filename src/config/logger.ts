import winston, {format} from "winston";

class Logger {

    public mainLogger = this.registerLogger("main");

    public registerLogger(loggerName: string): winston.Logger {
        return winston.loggers.add(loggerName, {
            level: process.env.LOGGING_LEVEL,
            format: format.combine(
                format.timestamp(),
                format.errors({ stack: true }),
                //define the order of the log properties
                format.printf(info => `${JSON.stringify({
                    timestamp: info.timestamp,
                    level: info.level,
                    message: info.message || "",
                    service: info.service,
                    name: info.name,
                    stack: info.stack,
                    logger: loggerName
                })}`)
            ),
            defaultMeta: { service: process.env.SERVICE_NAME },
            transports: [
                new (winston.transports.Console)(),
            ]
        });
    }
}

export const logger = new Logger();

// Add an uncaughtException event handler to log then properly and avoid server crashing.
const errorTypes = ['unhandledRejection', 'uncaughtException']

errorTypes.forEach(type => {
    process.on(type, async (err) => {
        logger.mainLogger.error(`${type} error:`, err);
    })
})
