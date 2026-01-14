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

export interface HotTool {
    name: string;
    description: string;
    stars: string;
    category: string;
    url: string;
    growth?: string; // e.g. "+1.2k"
    competitor?: string; // e.g. "Notion"
    feature?: string; // e.g. "Offline first support"
    bestFor?: string; // e.g. "Freelancers"
}

interface WeeklyDigestEmailProps {
    hotTools?: HotTool[];
    introText?: string;
    outroText?: string;
}

// 默认数据用于预览
const defaultHotTools: HotTool[] = [
    {
        name: 'Supabase',
        description: 'The Open Source Firebase Alternative',
        stars: '65k',
        category: 'Database',
        url: 'https://supabase.com',
        growth: '+1.5k'
    },
    {
        name: 'Typebot',
        description: 'Conversational forms builder alternative to Typeform',
        stars: '8.2k',
        category: 'Form Builder',
        url: 'https://typebot.io',
        growth: '+400'
    },
    {
        name: 'NocoDB',
        description: 'Open Source Airtable Alternative',
        stars: '41k',
        category: 'No-Code',
        url: 'https://nocodb.com',
        growth: '+800'
    }
];

export const WeeklyDigestEmail = ({
    hotTools = defaultHotTools,
    introText,
    outroText,
}: WeeklyDigestEmailProps) => {
    const previewText = introText || `🔥 This week's top open-source alternatives are here!`;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saas-killer.chaos-meme.cn';

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
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
                                    <Text style={badgeStyle}>WEEKLY DIGEST</Text>
                                </td>
                            </tr>
                        </table>
                    </Section>

                    {/* Intro */}
                    <Section style={heroSection}>
                        <Heading style={heroHeading}>
                            Your Weekly Dose of <span style={{ color: '#818cf8' }}>Open Source</span>.
                        </Heading>
                        {introText ? (
                            <Text style={heroText} dangerouslySetInnerHTML={{ __html: introText.replace(/\n/g, '<br/>') }} />
                        ) : (
                            <Text style={heroText}>
                                We've tracked the fastest-growing projects this week. Here are the top picks you shouldn't miss.
                            </Text>
                        )}
                    </Section>

                    <Hr style={divider} />

                    {/* Tools List */}
                    <Section style={toolsSection}>
                        {hotTools.map((tool, index) => (
                            <Link key={index} href={tool.url} style={{ textDecoration: 'none' }}>
                                <Section style={toolCard}>
                                    <table width="100%">
                                        <tr>
                                            <td style={{ verticalAlign: 'top' }}>
                                                <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={toolName}>{tool.name}</span>
                                                    {tool.growth && (
                                                        <span style={growthBadge}>📈 {tool.growth}</span>
                                                    )}
                                                </div>

                                                {/* High Value Insights Tags */}
                                                <div style={{ marginBottom: '8px' }}>
                                                    {tool.competitor && (
                                                        <span style={insightTag}>
                                                            <span style={{ opacity: 0.7 }}>Replaces: </span>
                                                            <strong style={{ color: '#f87171' }}>{tool.competitor}</strong>
                                                        </span>
                                                    )}
                                                </div>

                                                <Text style={toolDescription}>{tool.description}</Text>

                                                {tool.feature && (
                                                    <Text style={featureText}>
                                                        💡 <strong>Killer Feature:</strong> {tool.feature}
                                                    </Text>
                                                )}
                                            </td>
                                            <td align="right" style={{ verticalAlign: 'top', width: '90px' }}>
                                                <div style={{ textAlign: 'right', marginBottom: '8px' }}>
                                                    <Text style={toolMeta}>⭐ {tool.stars}</Text>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <Text style={toolCategory}>{tool.category}</Text>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </Section>
                            </Link>
                        ))}
                    </Section>

                    {/* Outro - Optional */}
                    {outroText && (
                        <Section style={{ padding: '0 24px 24px 24px', backgroundColor: '#111', color: '#a1a1aa', fontSize: '15px' }}>
                            <Text style={heroText} dangerouslySetInnerHTML={{ __html: outroText.replace(/\n/g, '<br/>') }} />
                        </Section>
                    )}

                    {/* CTA */}
                    <Section style={{ textAlign: 'center', margin: '32px 0' }}>
                        <Button style={ctaButton} href={baseUrl}>
                            🔍 Discover More Tools
                        </Button>
                    </Section>

                    <Hr style={divider} />

                    {/* Footer */}
                    <Section style={footerSection}>
                        <Text style={footerText}>
                            See you next week! 👋
                            <br />
                            — The SaaS Killer Team
                        </Text>
                        <Text style={footerCopyright}>
                            © {new Date().getFullYear()} SaaS Killer ·
                            <Link href={baseUrl} style={footerLink}>Visit Website</Link> ·
                            <Link href={`${baseUrl}/unsubscribe`} style={footerLink}>
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
// Reuse styles from WelcomeEmail for consistency
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
    fontSize: '26px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 12px 0',
    lineHeight: '1.3',
};

const heroText = {
    fontSize: '15px',
    lineHeight: '24px',
    color: '#a1a1aa',
    margin: '0',
};

const divider = {
    borderColor: '#222',
    margin: '0',
};

const toolsSection = {
    padding: '24px',
    backgroundColor: '#111',
};

const toolCard = {
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderLeft: '3px solid #6366f1',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
};

const toolName = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    marginRight: '8px',
};

const toolDescription = {
    fontSize: '14px',
    color: '#a1a1aa',
    margin: '4px 0 0 0',
    lineHeight: '1.4',
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

const growthBadge = {
    fontSize: '11px',
    color: '#4ade80',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    padding: '2px 6px',
    borderRadius: '4px',
    verticalAlign: 'middle',
    display: 'inline-block',
};

const insightTag = {
    fontSize: '12px',
    color: '#d4d4d8',
    backgroundColor: '#27272a',
    padding: '2px 8px',
    borderRadius: '4px',
    display: 'inline-block',
    marginRight: '8px',
    marginBottom: '4px',
};

const featureText = {
    fontSize: '13px',
    color: '#a5b4fc', // Indigo-300
    margin: '6px 0 0 0',
    lineHeight: '1.4',
    fontStyle: 'italic' as const,
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
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
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

const footerCopyright = {
    fontSize: '11px',
    color: '#52525b',
    margin: '0',
};

const footerLink = {
    color: '#71717a',
    textDecoration: 'none',
};

export default WeeklyDigestEmail;
