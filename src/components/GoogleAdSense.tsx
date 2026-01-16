"use client";

import Script from "next/script";

export default function GoogleAdSense() {
    const pId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

    if (!pId) {
        return null;
    }

    return (
        <Script
            id="google-adsense"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
    );
}
