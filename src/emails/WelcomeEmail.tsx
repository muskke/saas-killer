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
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
    email?: string;
}

export const WelcomeEmail = ({
    email = 'subscriber@example.com',
}: WelcomeEmailProps) => {
    const previewText = `Welcome to SaaS Killer! Get ready to discover the best open-source alternatives.`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Section className="mt-[32px]">
                            <div className="flex items-center gap-2">
                                {/* You can replace this with your actual Logo URL */}
                                <span className="text-2xl font-black text-indigo-600">SaaS Killer</span>
                            </div>
                        </Section>

                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Welcome to the <strong>SaaS Killer</strong> Club! 🚀
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Hello there,
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Thanks for joining us! You're now part of a community of 5,000+ developers who refuse to pay for overpriced software when there's an open-source alternative.
                        </Text>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#4f46e5] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href="http://localhost:3000" // Update with real domain later
                            >
                                Explore Hidden Gems
                            </Button>
                        </Section>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Every week, we'll send you a digest of the hottest new open-source tools. No spam, straight to the point.
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Happy hacking,
                            <br />
                            The SaaS Killer Team
                        </Text>
                    </Container>

                    <Container className="mx-auto text-center">
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            If you didn't sign up for this, you can <Link href="#" className="text-indigo-600 underline">unsubscribe</Link> anytime.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default WelcomeEmail;
