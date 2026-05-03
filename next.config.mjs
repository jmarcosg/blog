/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "www.github.com" },
			{ protocol: "https", hostname: "www.notion.so" },
			{
				protocol: "https",
				hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
			},
			{ protocol: "https", hostname: "s3.us-west-2.amazonaws.com" },
			{ protocol: "https", hostname: "images.unsplash.com" },
		],
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	turbopack: {
		// Lock the workspace root to this project; without it Next 16 walks up
		// the tree and picks the first lockfile it finds.
		root: import.meta.dirname,
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
