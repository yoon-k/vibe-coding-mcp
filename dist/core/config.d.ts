/**
 * Configuration validation and management
 */
export interface ConfigStatus {
    platform: string;
    configured: boolean;
    missing: string[];
}
export interface ConfigValidationResult {
    valid: boolean;
    platforms: ConfigStatus[];
    warnings: string[];
}
/**
 * Validates configuration for all platforms
 */
export declare function validateConfiguration(): ConfigValidationResult;
/**
 * Logs configuration status on startup
 */
export declare function logConfigurationStatus(): void;
/**
 * Gets configuration status for a specific platform
 */
export declare function getPlatformConfig(platform: string): ConfigStatus | undefined;
/**
 * Checks if a platform is properly configured
 */
export declare function isPlatformConfigured(platform: string): boolean;
//# sourceMappingURL=config.d.ts.map