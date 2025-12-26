import {
  validatePathWithinDirectory,
  sanitizeFilename,
  validateWebhookUrl,
  SLACK_ALLOWED_HOSTS,
  DISCORD_ALLOWED_HOSTS
} from '../src/core/security.js';

describe('Security Utilities', () => {
  describe('validatePathWithinDirectory', () => {
    it('should allow paths within directory', () => {
      const result = validatePathWithinDirectory('/home/user/docs/file.txt', '/home/user/docs');
      expect(result).toBe('/home/user/docs/file.txt');
    });

    it('should throw on path traversal attempts', () => {
      expect(() => {
        validatePathWithinDirectory('/home/user/docs/../secret/file.txt', '/home/user/docs');
      }).toThrow();
    });

    it('should throw when path escapes directory', () => {
      expect(() => {
        validatePathWithinDirectory('/etc/passwd', '/home/user/docs');
      }).toThrow();
    });
  });

  describe('sanitizeFilename', () => {
    it('should remove parent directory references', () => {
      const result = sanitizeFilename('../../../etc/passwd');
      expect(result).not.toContain('..');
    });

    it('should remove invalid characters', () => {
      const result = sanitizeFilename('file<>:"/\\|?*.txt');
      expect(result).not.toMatch(/[<>:"/\\|?*]/);
    });

    it('should replace whitespace with dashes', () => {
      const result = sanitizeFilename('my file name.txt');
      expect(result).toBe('my-file-name.txt');
    });

    it('should respect max length', () => {
      const longName = 'a'.repeat(300);
      const result = sanitizeFilename(longName, 100);
      expect(result.length).toBeLessThanOrEqual(100);
    });

    it('should handle empty string', () => {
      const result = sanitizeFilename('');
      expect(result).toBe('');
    });
  });

  describe('validateWebhookUrl', () => {
    describe('Slack webhooks', () => {
      it('should accept valid Slack webhook URLs', () => {
        expect(() => {
          validateWebhookUrl('https://hooks.slack.com/services/xxx', SLACK_ALLOWED_HOSTS);
        }).not.toThrow();
      });

      it('should reject non-Slack URLs', () => {
        expect(() => {
          validateWebhookUrl('https://evil.com/webhook', SLACK_ALLOWED_HOSTS);
        }).toThrow();
      });

      it('should reject HTTP URLs', () => {
        expect(() => {
          validateWebhookUrl('http://hooks.slack.com/services/xxx', SLACK_ALLOWED_HOSTS);
        }).toThrow();
      });
    });

    describe('Discord webhooks', () => {
      it('should accept valid Discord webhook URLs', () => {
        expect(() => {
          validateWebhookUrl('https://discord.com/api/webhooks/xxx', DISCORD_ALLOWED_HOSTS);
        }).not.toThrow();
      });

      it('should accept discordapp.com URLs', () => {
        expect(() => {
          validateWebhookUrl('https://discordapp.com/api/webhooks/xxx', DISCORD_ALLOWED_HOSTS);
        }).not.toThrow();
      });

      it('should reject non-Discord URLs', () => {
        expect(() => {
          validateWebhookUrl('https://evil.com/webhook', DISCORD_ALLOWED_HOSTS);
        }).toThrow();
      });
    });

    it('should reject invalid URL format', () => {
      expect(() => {
        validateWebhookUrl('not-a-url', SLACK_ALLOWED_HOSTS);
      }).toThrow();
    });

    it('should reject internal URLs (SSRF prevention)', () => {
      expect(() => {
        validateWebhookUrl('https://localhost/webhook', SLACK_ALLOWED_HOSTS);
      }).toThrow();

      expect(() => {
        validateWebhookUrl('https://127.0.0.1/webhook', SLACK_ALLOWED_HOSTS);
      }).toThrow();
    });
  });
});
