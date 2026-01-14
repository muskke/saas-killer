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
    Tailwind,
    Hr,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
    email?: string;
}

export const WelcomeEmail = ({
    email = 'subscriber@example.com',
}: WelcomeEmailProps) => {
    const previewText = `Welcome to the dark side. 🚀`;

    // Production URL (fallback to localhost for dev)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saas-killer.chaos-meme.cn';

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main} className="bg-black my-auto mx-auto font-sans text-gray-200">
                <Container style={container} className="border border-solid border-white/10 rounded-2xl my-[40px] mx-auto p-[20px] max-w-[465px] bg-[#09090b]">
                    <Section className="mt-[24px]">
                        <div className="flex items-center gap-2">
                            <Heading style={logo} as="h1">SaaS Killer</Heading>
                        </div>
                    </Section>

                    <Heading style={heading} className="text-white text-[24px] font-bold text-center p-0 my-[30px] mx-0">
                        Welcome to the <span style={{ color: '#818cf8' }}>Club</span>.
                    </Heading>

                    <Text style={text} className="text-gray-300 text-[14px] leading-[24px]">
                        Hello there,
                    </Text>

                    <Text style={text} className="text-gray-300 text-[14px] leading-[24px]">
                        You've just joined <strong>5,000+ developers</strong> who are tired of monthly subscriptions. We find the best open-source alternatives so you don't have to.
                    </Text>

                    <Section className="text-center mt-[32px] mb-[32px]">
                        <Button
                            style={button}
                            className="bg-indigo-600 rounded-lg text-white text-[12px] font-semibold no-underline text-center px-6 py-4 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                            href={baseUrl}
                        >
                            Explore Hidden Gems
                        </Button>
                    </Section>

                    <Text style={text} className="text-gray-300 text-[14px] leading-[24px]">
                        Every week, we'll drop a fresh batch of tools straight to your inbox.
                        <br />
                        No fluff. No spam. Just code.
                    </Text>

                    <Hr style={hr} className="border-white/10 my-[26px] mx-0 w-full" />

                    <Text style={footer} className="text-[#666666] text-[12px] leading-[24px]">
                        Happy hacking,
                        <br />
                        The SaaS Killer Team
                    </Text>
                </Container>

                <Container className="mx-auto text-center">
                    <Text style={footerLinks} className="text-[#444] text-[10px] leading-[24px]">
                        {/* Physical Address Placeholder */}
                        123 Open Source Ave, Tech City, TC 90210
                        <br />
                        <Link href={`${baseUrl}/unsubscribe?email=${email}`} style={{ color: '#666666', textDecoration: 'underline' }} className="text-[#666] underline hover:text-gray-400">
                            Unsubscribe
                        </Link>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

// Styles for email clients that strip classes (like QQ Mail)
const main = {
    backgroundColor: '#000000',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    width: '580px',
    maxWidth: '100%',
    backgroundColor: '#09090b',
    border: '1px solid #333',
    borderRadius: '12px',
    paddingLeft: '20px',
    paddingRight: '20px',
};

const logo = {
    fontSize: '24px',
    fontWeight: '900',
    color: '#818cf8', // Indigo-400
    margin: '0',
};

const heading = {
    fontSize: '32px',
    lineHeight: '1.3',
    fontWeight: '700',
    color: '#ffffff',
};

const text = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#d1d5db', // gray-300
};

const button = {
    backgroundColor: '#5e6ad2',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
};

const hr = {
    borderColor: '#333',
    margin: '20px 0',
    borderTop: '1px solid #333'
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
};

const footerLinks = {
    color: '#8898aa',
    fontSize: '12px',
    textAlign: 'center' as const,
};

export default WelcomeEmail;
