/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true
    },
    headers: async () => {
        const headers = [
            {
                key: "X-DNS-Prefetch-Control",
                value: "off"
            },
            {
                key: "X-Frame-Options",
                value: "DENY"
            },
            {
                key: 'X-Content-Type-Options',
                value: 'nosniff'
            }
        ];

        if (process.env.NODE_ENV !== "development") {
            headers.push({
                key: "Strict-Transport-Security",
                value: "max-age=63072000; includeSubDomains; preload"
            });
        }

        return [
            {
                source: '/',
                headers: headers
            }
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'mc-heads.net',
                port: '',
                pathname: '/avatar/**'
            },
            {
                protocol: 'https',
                hostname: "media.forgecdn.net",
                port: '',
                pathname: '/attachments/**'
            }
        ]
    }
}

module.exports = nextConfig
