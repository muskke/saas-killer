import { Resend } from 'resend';

// Initialize Resend with API Key from environment variables
// If variable is missing, it will throw an error when trying to send
export const resend = new Resend(process.env.RESEND_API_KEY);

export const MARKETING_EMAILS = {
    welcome: {
        subject: 'Welcome to SaaS Killer 🚀',
        from: 'SaaS Killer <hello@saas-killer.chaos-meme.cn>',
    }
};
