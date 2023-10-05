import './globals.css'
import {Inter} from 'next/font/google'
import {AppShell} from "@/app/AppShell";
import {AppProvider} from "@/app/AppProvider";
import {Analytics} from "@vercel/analytics/react";
import {AntdStyledComponentRegistry} from "@/components/antd/AntdStyledComponentRegistry";

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
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
    },
    openGraph: {
        title: 'CloudSettings',
        description: 'Web App for the CloudSettings Minecraft Mod',
        type: 'website',
        url: 'https://cloudsettings.blutmondgilde.de/'
    }
}

type Props = {
    children: React.ReactNode
}

export default function RootLayout({children,}: Props) {
    return (
        <html lang="en" className={"h-full"}>
        <body className={`${inter.className} min-h-screen m-0`}>
        <AntdStyledComponentRegistry>
            <AppProvider>
                <AppShell>
                    {children}
                </AppShell>
            </AppProvider>
        </AntdStyledComponentRegistry>
        <Analytics/>
        </body>
        </html>
    )
}
