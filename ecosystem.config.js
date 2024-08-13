module.exports = {
    apps: [
        {
            name: "CloudSettings",
            script: "node_modules/next/dist/bin/next",
            args: "start",
            exec_mode: 'cluster',
            autorestart: true,
            instances: Number(process.env.REPLICAS ?? 1),
            env_prod: {
                NODE_ENV: "production",
                PORT: process.env.PORT,
                DATABASE_URL: process.env.DATABASE_URL,
                NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
                AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID,
                AZURE_AD_CLIENT_SECRET: process.env.AZURE_AD_CLIENT_SECRET,
                AZURE_AD_TENANT_ID: process.env.AZURE_AD_TENANT_ID,
                CURSEFORGE_API_KEY: process.env.CURSEFORGE_API_KEY,
                MODRINTH_API_KEY: process.env.MODRINTH_API_KEY,
            }
        }
    ]
}
