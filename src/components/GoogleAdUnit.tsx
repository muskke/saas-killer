"use client";

import { useEffect, useRef } from "react";

type AdFormat = "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";

interface GoogleAdUnitProps {
    slot: string;
    format?: AdFormat;
    responsive?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export default function GoogleAdUnit({
    slot,
    format = "auto",
    responsive = true,
    className = "",
    style = {},
}: GoogleAdUnitProps) {
    const adRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error("GoogleAdUnit error:", err);
        }
    }, []);

    // 如果没有配置 Publisher ID，则不渲染（避免报错）
    // 注意：虽然 script 是全局的，但这里检查一下 id 还是好的，或者假设 script 已经处理了
    if (!process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID) {
        if (process.env.NODE_ENV === "development") {
            return (
                <div className={`bg-gray-200 border border-gray-300 p-4 text-center text-sm text-gray-500 ${className}`} style={style}>
                    [Dev Mode] Google Ad Unit PlaceHolder <br />
                    Slot: {slot}
                </div>
            )
        }
        return null;
    }

    return (
        <div className={`google-ad-container ${className}`} style={{ minHeight: "100px", ...style }}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive}
            ></ins>
        </div>
    );
}
