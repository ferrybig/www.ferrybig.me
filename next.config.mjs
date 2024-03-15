import withMDXFactory from '@next/mdx';
const withMDX = withMDXFactory();

const cspHeader = `
default-src 'self' analytics.ferrybig.me;
script-src 'self' 'unsafe-eval' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' blob: data:;
font-src 'self';
object-src 'none';
base-uri 'self';
frame-src 'self' projects.ferrybig.me giscus.app;
form-action 'self';
frame-ancestors 'none';
block-all-mixed-content;
`;

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
	images: {
		unoptimized: true,
	},
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'Content-Security-Policy',
						value: cspHeader.replace(/\n/g, ''),
					},
				],
			},
		];
	},
};

export default withMDX({
	// other next config
	...nextConfig,
});
