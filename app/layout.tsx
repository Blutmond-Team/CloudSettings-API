import '@ant-design/v5-patch-for-react-19';
import './globals.css'
import {Inter} from 'next/font/google'
import {AppShell} from "@/app/AppShell";
import {AppProvider} from "@/app/AppProvider";
import {Analytics} from "@vercel/analytics/react";
import {Metadata, Viewport} from "next";
import {SpeedInsights} from "@vercel/speed-insights/next"
import {AntdRegistry} from "@ant-design/nextjs-registry";

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
    title: 'CloudSettings',
    description: 'Web App for the CloudSettings Minecraft Mod',
    metadataBase: new URL('https://cloudsettings.blutmondgilde.de'),
    appLinks: {
        web: {
            url: 'https://cloudsettings.blutmondgilde.de/',
            should_fallback: true,
        },
    },
    openGraph: {
        title: 'CloudSettings',
        description: 'Web App for the CloudSettings Minecraft Mod',
        type: 'website',
        url: 'https://cloudsettings.blutmondgilde.de/',
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

export default function RootLayout({children}: LayoutProps<"/">) {
    return (
        <html lang="en" className={"h-full"}>
        <body className={`${inter.className} min-h-screen m-0`}>
        <AntdRegistry>
            <AppProvider>
                <AppShell>
                    {children}
                </AppShell>
            </AppProvider>
        </AntdRegistry>
        <Analytics/>
        <SpeedInsights/>
        </body>
        </html>
    )
}
