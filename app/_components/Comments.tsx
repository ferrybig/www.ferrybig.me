'use client';
import Giscus from '@giscus/react';
import classes from './Comments.module.css';

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
				emitMetadata="1"
				inputPosition="top"
				theme="preferred_color_scheme"
				lang="en"
				loading="lazy"
			/>
		</div>
	);
}
export default Comments;
