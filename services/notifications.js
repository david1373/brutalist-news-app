const nodemailer = require('nodemailer');
const { WebClient } = require('@slack/web-api');

class NotificationService {
  constructor() {
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    this.slackClient = process.env.SLACK_TOKEN ? 
      new WebClient(process.env.SLACK_TOKEN) : null;
  }

  async sendEmail(recipients, subject, content) {
    try {
      await this.emailTransporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: recipients.join(','),
        subject,
        html: content
      });
      return true;
    } catch (error) {
      console.error('Email notification failed:', error);
      return false;
    }
  }

  async sendSlackMessage(channel, message, blocks = []) {
    if (!this.slackClient) return false;

    try {
      await this.slackClient.chat.postMessage({
        channel,
        text: message,
        blocks
      });
      return true;
    } catch (error) {
      console.error('Slack notification failed:', error);
      return false;
    }
  }

  // Notification templates
  async notifyScrapingComplete(stats) {
    const emailContent = `
      <h2>Scraping Complete</h2>
      <p>Articles scraped: ${stats.totalArticles}</p>
      <ul>
        ${stats.sources.map(source => `
          <li>${source.name}: ${source.count} articles</li>
        `).join('')}
      </ul>
      <p>Duration: ${stats.duration}</p>
    `;

    const slackBlocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🤖 Scraping Complete"
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Total Articles:* ${stats.totalArticles}`
          },
          {
            type: "mrkdwn",
            text: `*Duration:* ${stats.duration}`
          }
        ]
      }
    ];

    await Promise.all([
      this.sendEmail(
        process.env.ADMIN_EMAILS?.split(',') || [],
        'Scraping Complete',
        emailContent
      ),
      this.sendSlackMessage(
        process.env.SLACK_CHANNEL,
        'Scraping Complete',
        slackBlocks
      )
    ]);
  }
}

module.exports = new NotificationService();