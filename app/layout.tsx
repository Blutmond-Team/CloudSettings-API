import './globals.css'
import {Inter} from 'next/font/google'
import {AppShell} from "@/app/AppShell";
import {AppProvider} from "@/app/AppProvider";
import {Analytics} from "@vercel/analytics/react";
import {AntdStyledComponentRegistry} from "@/components/antd/AntdStyledComponentRegistry";
import {Viewport} from "next";
import {SpeedInsights} from "@vercel/speed-insights/next"
import {auth} from "@/auth";

const inter = Inter({subsets: ['latin']});

export const metadata = {
    title: 'CloudSettings',
    description: 'Web App for the CloudSettings Minecraft Mod',
    metadataBase: new URL('https://cloudsettings.blutmondgilde.de'),
    appLinks: {
        web: {
            url: 'https://cloudsettings.blutmondgilde.de/',
            should_fallback: true
        }
    },
    openGraph: {
        title: 'CloudSettings',
        description: 'Web App for the CloudSettings Minecraft Mod',
        type: 'website',
        url: 'https://cloudsettings.blutmondgilde.de/'
    }
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

type Props = {
    children: React.ReactNode
}

export default async function RootLayout({children,}: Props) {
    const session = await auth();

    return (
        <html lang="en" className={"h-full"}>
        <body className={`${inter.className} min-h-screen m-0`}>
        <AntdStyledComponentRegistry>
            <AppProvider>
                <AppShell session={session}>
                    {children}
                </AppShell>
            </AppProvider>
        </AntdStyledComponentRegistry>
        <Analytics/>
        <SpeedInsights/>
        </body>
        </html>
    )
}
