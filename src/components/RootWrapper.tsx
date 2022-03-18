import { ReactNode } from "react"
import PageBase, {writeLinkToAsset} from "../PageBase";
import classes from './RootWrapper.module.css';

interface Props {
	children: ReactNode;
	title: string
	base: PageBase,
}

export default function RootWrapper({
	children,
	title,
	base,
}: Props) {
	return (
		<html className={classes.html} data-theme-white={classes.themeWhite} data-theme-dark={classes.themeDark}>
			<head>
				<link href={writeLinkToAsset(base, 'bundle.css')} rel="stylesheet"/>
				<title>{title}</title>
				<link href={writeLinkToAsset(base, 'instantclick.min.js')} rel="preload" as="script"/>
				<link href={writeLinkToAsset(base, 'main.js')} rel="preload" as="script"/>
				<meta name="viewport" content="width=device-width, initial-scale=1"/>
				<meta name="author" content="Fernando van Loenhout"/>
				<meta name="color-scheme" content="light dark"/>
				{base.canonical ? <meta property="og:url" content={base.canonical}/> : null}
				{base.canonical ? <link rel="canonical" href={base.canonical}/> : null}
				<link rel="icon" type="image/png" sizes="16x16" href={writeLinkToAsset(base, "favicon-16x16.png")}/>
				<link rel="icon" type="image/png" sizes="32x32" href={writeLinkToAsset(base, "favicon-32x32.png")}/>
				<link rel="icon" type="image/png" sizes="96x96" href={writeLinkToAsset(base, "favicon-96x96.png")}/>
				<link rel="icon" type="image/png" sizes="194x194" href={writeLinkToAsset(base, "favicon-194x194.png")}/>
				<link rel="icon" href="/favicon.ico"/>
			</head>
			<body data-no-instant>
				{children}
				<script src={writeLinkToAsset(base, 'instantclick.min.js')} data-no-instant/>
				<script src={writeLinkToAsset(base, 'main.js')} data-no-instant/>
			</body>
		</html>
	)
}