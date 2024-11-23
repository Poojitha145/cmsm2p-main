import { createLogger, transports, format, Logger as WinstonLogger } from 'winston';
import { ConfigHelper } from '../util';

export namespace Logger {
    const Level = {
        DEBUG: 'DEBUG',
        INFO: 'INFO ',
        WARN: 'WARN ',
        ERROR: 'ERROR',
        CRITICAL: 'CRITICAL'
    }

    /**
     * it's a console.log
     * @param message 
     * @param optionalParams 
     */
    export const log = (message?: any, ...optionalParams: any[]) => {
        console.log(message, optionalParams);
    }

    /**
     * fine-grained statements concerning program state, typically used for debugging;
     * @param uuid 
     * @param label 
     * @param message 
     * @param data 
     */
    export const debug = (uuid: string, label: string, message: string, data?: any) => {
        logger.debug({ uuid: uuid, type: Level.DEBUG, label: label, message: message, data: data });
    }

    /**
     * informational statements concerning program state, representing program events or behavior tracking;
     * @param uuid 
     * @param label 
     * @param message 
     * @param data 
     */
    export const info = (uuid: string, label: string, message: string, data?: any) => {
        logger.info({ uuid: uuid, type: Level.INFO, label: label, message: message, data: data });
    }

    /**
     * statements that describe potentially harmful events or states in the program;
     * @param uuid 
     * @param label 
     * @param message 
     * @param data 
     */
    export const warn = (uuid: string, label: string, message: string, data?: any) => {
        logger.warn({ uuid: uuid, type: Level.WARN, label: label, message: message, data: data });
    }

    /**
     * statements that describe non-fatal errors in the application; 
     * this level is used quite often for logging handled exceptions;
     * @param uuid 
     * @param label 
     * @param message 
     * @param error 
     * @param data 
     */
    export const error = (uuid: string, label: string, message: string, error?: any, data?: any) => {
        logger.error({ uuid: uuid, type: Level.ERROR, label: label, message: message, error: error, data: data });
    }

    /**
     * statements representing the most severe of error conditions, assumedly resulting in program termination.
     * @param uuid 
     * @param label 
     * @param message 
     * @param error 
     * @param data 
     */
    export const critical = (uuid: string, label: string, message: string, error?: any, data?: any) => {
        logger.error({ uuid: uuid, type: Level.CRITICAL, label: label, message: message, error: error, data: data });
    }

    const logger: WinstonLogger = createLogger({
        transports: [
            new transports.Console({
                level: ConfigHelper.getDefaultProcessEnv('APP_LOG_LEVEL', 'debug'),
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
                            + (options.data ? ', ' + options.data : '')
                            + (options.meta && Object.keys(options.meta).length ?
                                ', ' + JSON.stringify(options.meta, null, 4) : '')
                            + (options.error ? ', ' + options.error : '');
                    })
                )
            })
        ]
    });
}