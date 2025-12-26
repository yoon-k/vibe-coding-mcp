import { Platform, PublishOptions, PublishResult } from '../types/index.js';
import { publishToNotion } from '../platforms/notion.js';
import { publishToGitHubWiki } from '../platforms/github-wiki.js';
import { publishToObsidian } from '../platforms/obsidian.js';
import { publishToConfluence } from '../platforms/confluence.js';
import { sendSlackNotification } from '../platforms/slack.js';
import { sendDiscordNotification } from '../platforms/discord.js';
import { createToolLogger } from '../core/logger.js';

const logger = createToolLogger('publishDocument');

export interface PublishDocumentInput {
  document: string;
  title: string;
  platform: Platform;
  options?: Partial<PublishOptions>;
}

export interface PublishDocumentOutput {
  result: PublishResult;
}

export async function publishDocument(input: PublishDocumentInput): Promise<PublishDocumentOutput> {
  const { document, title, platform, options } = input;

  let result: PublishResult;

  logger.info('Publishing document', { platform, title });

  try {
    switch (platform) {
      case 'notion':
        result = await publishToNotion(document, title, options);
        break;
      case 'github-wiki':
        result = await publishToGitHubWiki(document, title, options);
        break;
      case 'obsidian':
        result = await publishToObsidian(document, title, options);
        break;
      case 'confluence':
        result = await publishToConfluence(document, title, options);
        break;
      case 'slack': {
        const slackResult = await sendSlackNotification(
          `📄 **${title}**\n\n${document.slice(0, 2000)}${document.length > 2000 ? '...' : ''}`,
          { webhookUrl: options?.webhookUrl }
        );
        result = {
          success: slackResult.success,
          platform: 'slack',
          error: slackResult.error
        };
        break;
      }
      case 'discord': {
        const discordResult = await sendDiscordNotification(
          `📄 **${title}**\n\n${document.slice(0, 2000)}${document.length > 2000 ? '...' : ''}`,
          { webhookUrl: options?.webhookUrl }
        );
        result = {
          success: discordResult.success,
          platform: 'discord',
          error: discordResult.error
        };
        break;
      }
      default:
        result = {
          success: false,
          platform,
          error: `Unsupported platform: ${platform}`
        };
    }

    if (result.success) {
      logger.info('Document published successfully', { platform, url: result.url });
    } else {
      logger.warn('Document publish failed', { platform, error: result.error });
    }
  } catch (error) {
    logger.error('Document publish error', error as Error, { platform });
    result = {
      success: false,
      platform,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }

  return { result };
}

export const publishDocumentSchema = {
  name: 'muse_publish_document',
  description: 'Publishes generated documents to external platforms (Notion, GitHub Wiki, Obsidian, Confluence, Slack, or Discord).',
  inputSchema: {
    type: 'object',
    properties: {
      document: {
        type: 'string',
        description: 'The document content to publish'
      },
      title: {
        type: 'string',
        description: 'Title of the document'
      },
      platform: {
        type: 'string',
        enum: ['notion', 'github-wiki', 'obsidian', 'confluence', 'slack', 'discord'],
        description: 'Target platform for publishing'
      },
      options: {
        type: 'object',
        properties: {
          parentPageId: {
            type: 'string',
            description: 'Parent page ID for Notion or Confluence'
          },
          wikiPath: {
            type: 'string',
            description: 'Path in the wiki for GitHub Wiki'
          },
          vaultPath: {
            type: 'string',
            description: 'Vault path for Obsidian'
          },
          filename: {
            type: 'string',
            description: 'Custom filename for the document'
          },
          webhookUrl: {
            type: 'string',
            description: 'Webhook URL for Slack or Discord'
          }
        }
      }
    },
    required: ['document', 'title', 'platform']
  }
};
