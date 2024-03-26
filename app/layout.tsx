import './globals.css';
import type { Metadata, Viewport } from 'next/types';
import { Noto_Sans } from 'next/font/google';
import classNames from 'classnames';
import { Analytics } from './_components/Analytics';
import Nav from './_components/Nav';
import favicon409x409 from '@assets/face.png';
import favicon16x16 from '@assets/favicon-16x16.png';
import favicon32x32 from '@assets/favicon-32x32.png';
import appleTouch from '@assets/apple-touch-icon.png';
import classes from './layout.module.css';

const font = Noto_Sans({ weight: ['400', '600', '700'], subsets: ['latin'] });

export const viewport: Viewport = {
	themeColor: '#990000',
	colorScheme: 'dark light',
	initialScale: 1,
	width: '',
};

export const metadata: Metadata = {
	metadataBase: new URL('https://ferrybig.me'),
	title: 'Ferrybig.me',
	authors: [
		{
			name: 'Fernando',
			url: 'https://ferrybig.me',
		},
	],
	formatDetection:{
		address: false,
		date: false,
		email: false,
		telephone: false,
		url: false,
	},
	icons: {
		icon: [
			{
				url: favicon409x409.src,
				sizes: '409x409',
				type: 'image/png',
			},
			{
				url: favicon32x32.src,
				sizes: '32x32',
				type: 'image/png',
			},
			{
				url: favicon16x16.src,
				sizes: '16x16',
				type: 'image/png',
			},
			{
				url: '/favicon.ico',
				sizes: '48x48',
			},
		],
		apple: {
			url: appleTouch.src,
			sizes: '180x180',
		},
	},
	manifest: '/site.webmanifest',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={classNames(font.className, classes.body)}>
				<Analytics/>
				<div className={classes.skipToContent}>
					Skip to <a href="#main">the article</a>
				</div>
				<header className={classes.barTop}>
					<Nav/>
				</header>
				{children}
				<footer id="footer" className={classes.barBottom}>
					<div className={classes.footer}>
					</div>
				</footer>
			</body>
		</html>
	);
}
