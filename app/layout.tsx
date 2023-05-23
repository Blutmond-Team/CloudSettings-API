import './globals.css'
import {Inter} from 'next/font/google'
import {AppShell} from "@/app/AppShell";
import {AppProvider} from "@/app/AppProvider";

const inter = Inter({subsets: ['latin']})

export const metadata = {
    title: 'CloudSettings',
    description: 'Management Interface for the CloudSettings Minecraft Mod',
}

type Props = {
    children: React.ReactNode
}

export default function RootLayout({children,}: Props) {
    return (
        <html lang="en" className={"h-full"}>
        <body className={`${inter.className} h-full`}>
        <AppProvider>
            <AppShell>
                {children}
            </AppShell>
        </AppProvider>
        </body>
        </html>
    )
}
