'use client';
import Giscus from '@giscus/react';
import classes from './Comments.module.css';
import { SITE_URL } from '@/metadata';

const themeUrl = (process.env.NODE_ENV === 'development' ? 'http://localhost:2999/' : SITE_URL) + 'giscus.css';

function Comments() {
	return (
		<div className={classes.root}>
			<Giscus
				repo="ferrybig/www.ferrybig.me"
				repoId="R_kgDOHBif1g="
				category="Announcements"
				categoryId="DIC_kwDOHBif1s4CdpTo"
				mapping="pathname"
				strict="1"
				reactionsEnabled="1"
				inputPosition="bottom"
				theme={themeUrl}
				lang="en"
				loading="lazy"
			/>
		</div>
	);
}
export default Comments;
