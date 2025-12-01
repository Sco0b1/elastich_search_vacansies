/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/es/:path*',
                destination: 'http://localhost:9200/:path*'
            }
        ];
    }
};

module.exports = nextConfig;