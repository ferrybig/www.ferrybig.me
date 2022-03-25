import PageBase from '../PageBase';
import Output from './Output';
import themeClasses from '../theme.module.css';
import './RootWrapper.module.css';
import { JSXNode } from '../jsx/jsx-runtime';

interface Props {
	children: JSXNode;
	title: string
	base: PageBase,
	lang?: string,
}

export default function RootWrapper({
	children,
	title,
	base,
	lang = 'en',
}: Props) {
	return (
		<Output format="html">
			<html data-theme-light={themeClasses.themeLight} data-theme-dark={themeClasses.themeDark} lang={lang}>
				<head>
					<title>{title}</title>
					{base.css.map(css => (
						<link href={css} rel="preload" as="style"/>
					))}
					{base.js.map(js => (
						<link href={js} rel="preload" as="script"/>
					))}
					<meta name="viewport" content="width=device-width, initial-scale=1"/>
					<meta name="color-scheme" content="light dark"/>
					{Object.entries(base.meta).filter((e): e is [string, string] => !!e[1]).map(([name, value]) => (
						<meta property={name} content={value}/>
					))}
					{Object.entries(base.link).filter((e): e is [string, string] => !!e[1]).map(([name, value]) => (
						<link rel={name} href={value}/>
					))}
					{base.css.map(css => (
						<link href={css} rel="stylesheet"/>
					))}
					<link rel="icon" type="image/png" sizes="16x16" href={require('../images/favicon-16x16.png')}/>
					<link rel="icon" type="image/png" sizes="32x32" href={require('../images/favicon-32x32.png')}/>
					<link rel="icon" type="image/png" sizes="96x96" href={require('../images/favicon-96x96.png')}/>
					<link rel="icon" type="image/png" sizes="194x194" href={require('../images/favicon-194x194.png')}/>
					<link rel="icon" href="/favicon.ico"/>
				</head>
				<body data-no-instant>
					{children}
					{base.js.map(js => (
						<script defer src={js} data-no-instant/>
					))}
				</body>
			</html>
		</Output>
	);
}
