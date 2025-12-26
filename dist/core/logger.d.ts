/**
 * Structured logging utility for MCP server
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export interface LogContext {
    tool?: string;
    platform?: string;
    sessionId?: string;
    requestId?: string;
    duration?: number;
    [key: string]: unknown;
}
export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: LogContext;
    error?: {
        name: string;
        message: string;
        stack?: string;
    };
}
declare class Logger {
    private minLevel;
    private static levelPriority;
    setLevel(level: LogLevel): void;
    private shouldLog;
    private formatEntry;
    private log;
    debug(message: string, context?: LogContext): void;
    info(message: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    error(message: string, error?: Error, context?: LogContext): void;
    /**
     * Creates a child logger with preset context
     */
    child(defaultContext: LogContext): ChildLogger;
    /**
     * Measures and logs execution time
     */
    time<T>(label: string, fn: () => Promise<T>, context?: LogContext): Promise<T>;
}
declare class ChildLogger {
    private parent;
    private defaultContext;
    constructor(parent: Logger, defaultContext: LogContext);
    private mergeContext;
    debug(message: string, context?: LogContext): void;
    info(message: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    error(message: string, error?: Error, context?: LogContext): void;
}
export declare const logger: Logger;
export declare function createToolLogger(toolName: string): ChildLogger;
export {};
//# sourceMappingURL=logger.d.ts.map