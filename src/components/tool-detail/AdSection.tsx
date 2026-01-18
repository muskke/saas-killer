import AdBanner from "@/components/AdBanner";

interface AdSectionProps {
    category: string;
}

export default function AdSection({ category }: AdSectionProps) {
    return (
        <div className="mb-8">
            <AdBanner category={category} />
        </div>
    );
}
