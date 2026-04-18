/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "www.github.com",
			},
			{
				protocol: "https",
				hostname: "www.notion.so",
			},
		],
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		config.resolve.alias.canvas = false;
		config.resolve.alias.encoding = false;
		return config;
	},
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, s-maxage=60, stale-while-revalidate=300",
					},
				],
			},
		];
	},
};

export default nextConfig;
