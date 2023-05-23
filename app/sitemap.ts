import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://blutmond-team.github.io/CloudSettings-API";
    return [
        {
            url: baseUrl,
            lastModified: new Date(),
        }
    ];
}
