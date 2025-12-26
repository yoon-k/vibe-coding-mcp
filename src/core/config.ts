/**
 * Configuration validation and management
 */

import { logger } from './logger.js';

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
 * Platform configuration requirements
 */
const platformRequirements: Record<string, { required: string[]; optional: string[] }> = {
  notion: {
    required: ['NOTION_API_KEY'],
    optional: ['NOTION_DATABASE_ID']
  },
  'github-wiki': {
    required: ['GITHUB_TOKEN', 'GITHUB_REPO'],
    optional: []
  },
  obsidian: {
    required: [],
    optional: ['OBSIDIAN_VAULT_PATH']
  },
  confluence: {
    required: ['CONFLUENCE_BASE_URL', 'CONFLUENCE_USERNAME', 'CONFLUENCE_API_TOKEN', 'CONFLUENCE_SPACE_KEY'],
    optional: []
  },
  slack: {
    required: [],
    optional: ['SLACK_WEBHOOK_URL']
  },
  discord: {
    required: [],
    optional: ['DISCORD_WEBHOOK_URL']
  }
};

/**
 * Validates configuration for all platforms
 */
export function validateConfiguration(): ConfigValidationResult {
  const platforms: ConfigStatus[] = [];
  const warnings: string[] = [];

  for (const [platform, requirements] of Object.entries(platformRequirements)) {
    const missing: string[] = [];

    for (const envVar of requirements.required) {
      if (!process.env[envVar]) {
        missing.push(envVar);
      }
    }

    const configured = missing.length === 0;

    platforms.push({
      platform,
      configured,
      missing
    });

    if (!configured && requirements.required.length > 0) {
      warnings.push(`${platform}: Missing required env vars: ${missing.join(', ')}`);
    }
  }

  const valid = platforms.some(p => p.configured);

  return { valid, platforms, warnings };
}

/**
 * Logs configuration status on startup
 */
export function logConfigurationStatus(): void {
  const result = validateConfiguration();

  logger.info('Configuration validation complete', {
    valid: result.valid,
    configuredPlatforms: result.platforms.filter(p => p.configured).map(p => p.platform)
  });

  for (const warning of result.warnings) {
    logger.warn(warning);
  }

  if (!result.valid) {
    logger.warn('No platforms are fully configured. Some features may not work.');
  }
}

/**
 * Gets configuration status for a specific platform
 */
export function getPlatformConfig(platform: string): ConfigStatus | undefined {
  const result = validateConfiguration();
  return result.platforms.find(p => p.platform === platform);
}

/**
 * Checks if a platform is properly configured
 */
export function isPlatformConfigured(platform: string): boolean {
  const config = getPlatformConfig(platform);
  return config?.configured ?? false;
}
