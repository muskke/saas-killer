import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Hr,
} from '@react-email/components';
import * as React from 'react';

// 简化的工具类型 (用于邮件展示)
export interface HotTool {
    name: string;
    description: string;
    stars: string;
    category: string;
    url: string;
}

interface WelcomeEmailProps {
    email?: string;
    hotTools?: HotTool[];
}

// 默认工具数据 (仅作为 fallback)
const defaultHotTools: HotTool[] = [
    {
        name: 'Cal.com',
        description: 'Calendly 的开源替代品',
        stars: '32k',
        category: 'Scheduling',
        url: 'https://cal.com'
    },
    {
        name: 'Appwrite',
        description: 'Firebase 的开源替代品',
        stars: '44k',
        category: 'BaaS',
        url: 'https://appwrite.io'
    },
    {
        name: 'Documenso',
        description: 'DocuSign 的开源替代品',
        stars: '8k',
        category: 'E-Signature',
        url: 'https://documenso.com'
    }
];

// 格式化星星数 (如 45000 -> "45k")
function formatStars(stars: number | string): string {
    const num = typeof stars === 'string' ? parseInt(stars, 10) : stars;
    if (isNaN(num)) return String(stars);
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return String(num);
}

export const WelcomeEmail = ({
    email = 'subscriber@example.com',
    hotTools = defaultHotTools,
}: WelcomeEmailProps) => {
    const previewText = `🚀 Welcome to SaaS Killer - Your weekly dose of open-source gems`;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saas-killer.chaos-meme.cn';

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header with Logo */}
                    <Section style={headerSection}>
                        <table width="100%">
                            <tr>
                                <td>
                                    <Text style={logoText}>
                                        <span style={{ color: '#818cf8' }}>SaaS</span>
                                        <span style={{ color: '#c084fc' }}>Killer</span>
                                    </Text>
                                </td>
                                <td align="right">
                                    <Text style={badgeStyle}>🔥 NEW MEMBER</Text>
                                </td>
                            </tr>
                        </table>
                    </Section>

                    {/* Hero Section */}
                    <Section style={heroSection}>
                        <Heading style={heroHeading}>
                            Welcome to the <span style={{ color: '#818cf8' }}>Club</span>. 🎉
                        </Heading>
                        <Text style={heroText}>
                            You've just joined <strong style={{ color: '#fff' }}>5,000+ developers</strong> who refuse to pay for overpriced SaaS.
                            <br />
                            We curate the best open-source alternatives, so you don't have to.
                        </Text>
                    </Section>

                    {/* CTA Button */}
                    <Section style={{ textAlign: 'center', marginTop: '24px', marginBottom: '32px' }}>
                        <Button style={ctaButton} href={baseUrl}>
                            🔍 Explore 200+ Tools
                        </Button>
                    </Section>

                    <Hr style={divider} />

                    {/* Hot Tools Section - 动态数据 */}
                    <Section style={toolsSection}>
                        <Heading style={sectionHeading}>
                            🔥 This Week's Hot Picks
                        </Heading>

                        {hotTools.map((tool, index) => (
                            <Link key={index} href={tool.url} style={{ textDecoration: 'none' }}>
                                <Section style={toolCard}>
                                    <table width="100%">
                                        <tr>
                                            <td style={{ verticalAlign: 'top' }}>
                                                <Text style={toolName}>{tool.name}</Text>
                                                <Text style={toolDescription}>{tool.description}</Text>
                                            </td>
                                            <td align="right" style={{ verticalAlign: 'middle' }}>
                                                <Text style={toolMeta}>⭐ {tool.stars}</Text>
                                                <Text style={toolCategory}>{tool.category}</Text>
                                            </td>
                                        </tr>
                                    </table>
                                </Section>
                            </Link>
                        ))}
                    </Section>

                    <Hr style={divider} />

                    {/* What to Expect */}
                    <Section style={{ padding: '0 20px' }}>
                        <Heading style={sectionHeading}>
                            📬 What You'll Get
                        </Heading>
                        <Text style={listItem}>✅ Weekly curated open-source tools</Text>
                        <Text style={listItem}>✅ Early access to new discoveries</Text>
                        <Text style={listItem}>✅ Zero spam, pure value</Text>
                    </Section>

                    <Hr style={divider} />

                    {/* Social Links */}
                    <Section style={socialSection}>
                        <Text style={socialText}>Join the community:</Text>
                        <table width="100%">
                            <tr>
                                <td align="center">
                                    <Link href="https://github.com/muskke/saas-killer" style={socialLink}>
                                        ⭐ Star on GitHub
                                    </Link>
                                    <span style={{ color: '#444', margin: '0 12px' }}>|</span>
                                    <Link href="https://twitter.com/saaskiller" style={socialLink}>
                                        🐦 Follow on X
                                    </Link>
                                </td>
                            </tr>
                        </table>
                    </Section>

                    {/* Footer */}
                    <Section style={footerSection}>
                        <Text style={footerText}>
                            Happy hacking! 🚀
                            <br />
                            — The SaaS Killer Team
                        </Text>
                        <Text style={footerLinksStyle}>
                            <Link href={`${baseUrl}/unsubscribe?email=${email}`} style={unsubLink}>
                                Unsubscribe
                            </Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

// ============ STYLES ============

const main = {
    backgroundColor: '#0a0a0a',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '40px 0',
    maxWidth: '600px',
};

const headerSection = {
    padding: '20px 24px',
    backgroundColor: '#111',
    borderRadius: '12px 12px 0 0',
    borderBottom: '1px solid #222',
};

const logoText = {
    fontSize: '24px',
    fontWeight: '900',
    margin: '0',
};

const badgeStyle = {
    backgroundColor: '#312e81',
    color: '#a5b4fc',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    margin: '0',
};

const heroSection = {
    padding: '32px 24px',
    backgroundColor: '#111',
    textAlign: 'center' as const,
};

const heroHeading = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 16px 0',
    lineHeight: '1.3',
};

const heroText = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#a1a1aa',
    margin: '0',
};

const ctaButton = {
    backgroundColor: '#6366f1',
    color: '#ffffff',
    padding: '14px 28px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    textDecoration: 'none',
    display: 'inline-block',
};

const divider = {
    borderColor: '#222',
    margin: '0',
};

const toolsSection = {
    padding: '24px',
    backgroundColor: '#111',
};

const sectionHeading = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
    margin: '0 0 16px 0',
};

const toolCard = {
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
};

const toolName = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    margin: '0 0 4px 0',
};

const toolDescription = {
    fontSize: '13px',
    color: '#71717a',
    margin: '0',
};

const toolMeta = {
    fontSize: '13px',
    color: '#fbbf24',
    margin: '0 0 4px 0',
    textAlign: 'right' as const,
};

const toolCategory = {
    fontSize: '11px',
    color: '#6366f1',
    backgroundColor: '#1e1b4b',
    padding: '2px 8px',
    borderRadius: '4px',
    margin: '0',
    display: 'inline-block',
};

const listItem = {
    fontSize: '14px',
    color: '#d4d4d8',
    margin: '8px 0',
};

const socialSection = {
    padding: '24px',
    backgroundColor: '#111',
    textAlign: 'center' as const,
};

const socialText = {
    fontSize: '13px',
    color: '#71717a',
    margin: '0 0 12px 0',
};

const socialLink = {
    fontSize: '13px',
    color: '#a5b4fc',
    textDecoration: 'none',
};

const footerSection = {
    padding: '24px',
    backgroundColor: '#111',
    borderRadius: '0 0 12px 12px',
    textAlign: 'center' as const,
};

const footerText = {
    fontSize: '14px',
    color: '#71717a',
    margin: '0 0 16px 0',
};

const footerLinksStyle = {
    fontSize: '12px',
    color: '#52525b',
    margin: '0',
};

const unsubLink = {
    color: '#52525b',
    textDecoration: 'underline',
};

export default WelcomeEmail;
