import { createLogger, transports, format, Logger as WinstonLogger } from 'winston';

export namespace Logger {
    const Level = {
        DEBUG: 'DEBUG',
        INFO: 'INFO',
        WARN: 'WARN',
        ERROR: 'ERROR',
        CRITICAL: 'CRITICAL'
    }

    export const debug = (uuid: string, label: string, message: string, data?: any) => {
        logger.debug({ uuid: uuid, type: Level.DEBUG, label: label, message: message, data: data });
    }

    export const info = (uuid: string, label: string, message: string, data?: any) => {
        logger.info({ uuid: uuid, type: Level.INFO, label: label, message: message, data: data });
    }

    export const warn = (uuid: string, label: string, message: string, data?: any) => {
        logger.warn({ uuid: uuid, type: Level.WARN, label: label, message: message, data: data });
    }

    export const error = (uuid: string, label: string, message: string, error?: any, data?: any) => {
        logger.error({ uuid: uuid, type: Level.ERROR, label: label, message: message, error: error, data: data });
    }

    export const critical = (uuid: string, label: string, message: string, error?: any, data?: any) => {
        logger.error({ uuid: uuid, type: Level.CRITICAL, label: label, message: message, error: error, data: data });
    }

    const logger: WinstonLogger = createLogger({
        transports: [
            new transports.Console({
                format: format.combine(
                    format.json(),
                    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                    format.printf((options: any) => {
                        try {
                            if (typeof options.data === 'object') {
                                options.data = JSON.stringify(options.data);
                            }
                            if (options.error && options.error.stack) {
                                options.error = options.error.stack;
                            }
                        } catch (e: any) { console.error(e) }
                        return '[' + options.timestamp + '][' + options.type
                            + '][' + (options.uuid ? options.uuid : '')
                            + '][' + (options.label ? options.label : '')
                            + '] - ' + (options.message ? options.message : '')
                            + (options.data ? '\n' + options.data : '')
                            + (options.meta && Object.keys(options.meta).length ? '\n'
                                + JSON.stringify(options.meta, null, 4) : '')
                            + (options.error ? '\n' + options.error : '');
                    })
                )
            })
        ]
    });
}