import './globals.css'
import {Inter} from 'next/font/google'

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
        <html lang="en">
        <body className={inter.className}>{children}</body>
        </html>
    )
}
