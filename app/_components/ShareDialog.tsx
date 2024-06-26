'use client';
import { useEffect, useState } from 'react';
import classes from './ShareDialog.module.css';

// Code based on https://github.com/nimiq/web-share-shim/tree/master, licensed under MIT

type Definition =
| {
	title: string
	icon: string,
	link: (url: string, title: string) => string,
	action?: never,
}
| {
	title: string
	icon: string,
	action: (url: string, title: string) => void,
	link?: never,
}
const definitions: Definition[] = [
	{
		title: 'Whatsapp',
		link: (url, title) => `https://wa.me/?text=${encodeURIComponent(title + '\n' + url)}`,
		icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25"><path d="M20.504 3.504C18.246 1.246 15.246 0 12.05 0 5.466 0 .103 5.36.103 11.945c-.004 2.106.546 4.16 1.593 5.973L0 24.108l6.336-1.663c1.742.953 3.71 1.453 5.71 1.457h.005c6.587 0 11.946-5.36 11.95-11.95 0-3.19-1.242-6.19-3.496-8.448zm-8.453 18.38h-.003c-1.78 0-3.53-.482-5.055-1.384l-.363-.215-3.763.985 1.004-3.665-.233-.375c-.996-1.582-1.52-3.41-1.52-5.285 0-5.472 4.457-9.925 9.938-9.925 2.652 0 5.144 1.035 7.02 2.91 1.874 1.88 2.905 4.37 2.905 7.023 0 5.477-4.457 9.93-9.93 9.93zm5.446-7.44c-.297-.147-1.766-.87-2.04-.967-.272-.102-.472-.15-.67.148-.2.3-.77.973-.946 1.172-.172.195-.348.223-.645.074-.3-.147-1.26-.464-2.402-1.483-.887-.79-1.488-1.77-1.66-2.067-.176-.3-.02-.46.13-.61.135-.132.3-.347.448-.523.15-.17.2-.296.302-.496.097-.198.047-.374-.028-.522-.074-.148-.67-1.62-.92-2.22-.244-.58-.49-.5-.673-.51-.17-.008-.37-.008-.57-.008-.2 0-.523.074-.797.375-.273.297-1.043 1.02-1.043 2.488 0 1.47 1.07 2.89 1.22 3.09.148.195 2.105 3.21 5.1 4.504.712.308 1.266.492 1.7.63.715.225 1.367.194 1.883.12.574-.086 1.765-.723 2.015-1.422.247-.695.247-1.293.172-1.418-.074-.125-.273-.2-.574-.352z" fill="black" fill-rule="evenodd"/></svg>',
	},
	{
		title: 'Telegram',
		link: (url, title) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
		icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="23" viewBox="0 0 26 23"><path d="M24.075.002c-.336.016-.652.112-.933.22h-.004c-.285.11-1.64.673-3.7 1.523l-7.385 3.063C6.755 7.005 1.547 9.168 1.547 9.168l.063-.023s-.36.115-.735.37c-.19.122-.402.292-.586.557-.185.266-.333.674-.28 1.093.09.712.56 1.14.896 1.374.34.237.664.35.664.35h.008l4.884 1.62c.22.692 1.49 4.8 1.794 5.748.18.565.355.92.574 1.19.105.137.23.253.38.345.057.035.12.062.182.085.02.01.04.015.063.02l-.05-.012c.015.003.027.015.038.02.04.01.067.014.118.022.774.23 1.395-.243 1.395-.243l.036-.027 2.884-2.585 4.833 3.65.11.048c1.008.435 2.027.193 2.566-.234.544-.43.755-.98.755-.98l.035-.09 3.735-18.843c.105-.466.133-.9.016-1.324-.118-.424-.42-.82-.782-1.032-.367-.216-.73-.28-1.067-.266zm-.1 2.02c-.005.062.007.054-.02.173v.012l-3.7 18.647c-.016.027-.044.085-.118.143-.078.06-.14.1-.465-.027l-5.91-4.464-3.572 3.205.75-4.716 9.658-8.866c.4-.365.266-.442.266-.442.027-.447-.602-.13-.602-.13l-12.178 7.43-.004-.02-5.838-1.936v-.003c-.003 0-.01-.004-.015-.004.004 0 .03-.012.03-.012l.032-.014.03-.012 10.51-4.36c2.654-1.1 5.326-2.208 7.38-3.062 2.056-.85 3.576-1.474 3.662-1.51.082-.03.043-.03.102-.03z" fill-rule="nonzero" fill="black"/></svg>',
	},
	{
		title: 'Facebook',
		link: (url, title) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
		icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25"><path d="M12 0C5.41 0 0 5.137 0 11.5c0 3.39 1.57 6.402 4 8.5v4.625l4.438-2.22c1.128.34 2.308.595 3.562.595 6.59 0 12-5.137 12-11.5S18.59 0 12 0zm0 2c5.56 0 10 4.266 10 9.5S17.56 21 12 21c-1.195 0-2.336-.227-3.406-.594l-.406-.125L6 21.376v-2.25l-.375-.313C3.405 17.063 2 14.442 2 11.5 2 6.266 6.44 2 12 2zm-1.125 6.344l-6.03 6.375 5.405-3 2.875 3.092 5.97-6.468-5.282 2.97-2.938-2.97z" fill-rule="nonzero" fill="black"/></svg>',
	},
	{
		title: 'X',
		link: (url, title) => `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
		icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M17.9686 14.1623L26.7065 4H24.6358L17.0488 12.8238L10.9891 4H4L13.1634 17.3432L4 28H6.07069L14.0827 18.6817L20.4822 28H27.4714L17.9681 14.1623H17.9686ZM15.1326 17.4607L14.2041 16.132L6.81679 5.55961H9.99723L15.9589 14.0919L16.8873 15.4206L24.6368 26.5113H21.4564L15.1326 17.4612V17.4607Z" fill="black"/></svg>',
	},
	{
		title: 'LinkedIn',
		link: (url, title) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
		icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>',
	},
	{
		title: 'Email',
		link: (url, title) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(title + '\n' + url)}`,
		icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="black"><path d="M0 0h24v24H0z" fill="none"/><path d="M 20,4 4,4 C 2.9,4 2.01,4.9 2.01,6 L 2,18 c 0,1.1 0.9,2 2,2 l 16,0 c 1.1,0 2,-0.9 2,-2 L 22,6 C 22,4.9 21.1,4 20,4 z m 0.508475,14.508475 -17.0169495,0 0,-10.7118648 L 12,12.79661 20.508475,7.7966102 z M 11.694915,11 3.4915255,5.4915255 l 17.0169495,0 z"/></svg>',
	},
	{
		title: 'Sms',
		link: (url, title) => `sms:?&body=${encodeURIComponent(title + '\n' + url)}`,
		icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="black"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
	},
	{
		title: 'Copy',
		action: (url, title) => {
			navigator.clipboard.writeText(title + '\n' + url);
		},
		icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="28" viewBox="0 0 24 28"><path d="M13.867 0c-.56 0-1.178.006-1.864.006H7.64c-1.633 0-2.873-.003-3.9.103-1.025.106-1.926.336-2.592.946-.665.61-.916 1.437-1.03 2.377C0 4.373.007 5.51.007 7.005v10.019c0 2.547-.12 4.066.642 5.337.38.636 1.065 1.1 1.817 1.324.58.173 1.24.238 1.977.278.014.2.015.432.038.615.116.94.367 1.766 1.033 2.376.666.61 1.567.84 2.592.945 1.026.106 2.265.102 3.896.102h4.363c1.633 0 2.874.003 3.9-.104 1.026-.106 1.927-.336 2.592-.947.666-.61.916-1.437 1.03-2.377.116-.94.112-2.076.112-3.572v-9.996c0-1.498.003-2.635-.113-3.576-.116-.94-.367-1.766-1.033-2.376-.666-.61-1.567-.84-2.592-.945-.206-.022-.466-.022-.69-.036-.046-.706-.122-1.332-.33-1.885-.256-.675-.78-1.282-1.47-1.615-1.036-.5-2.22-.567-3.905-.57zM7.64 2.006h4.363c2.74 0 4.282.107 4.752.333.236.113.3.173.424.5.09.236.15.66.197 1.17-.34 0-.632-.005-1.01-.005h-4.364c-1.633 0-2.874-.003-3.9.104-1.026.105-1.927.335-2.592.946-.665.61-.915 1.436-1.03 2.376-.115.94-.11 2.076-.11 3.572v9.998c0 .356.004.63.005.95-.53-.04-.976-.093-1.235-.17-.38-.112-.452-.178-.577-.386-.25-.417-.375-1.827-.375-4.372v-.01V7.005c0-1.495.007-2.604.098-3.35.09-.745.25-1.045.405-1.186.155-.143.482-.29 1.296-.374.813-.085 2.022-.09 3.655-.09zm4.363 4h4.363c1.63 0 2.84.005 3.653.09.812.082 1.14.228 1.294.37.154.14.315.44.407 1.187.092.745.1 1.854.1 3.35v9.998c0 1.496-.008 2.605-.1 3.35-.09.746-.25 1.046-.404 1.188-.154.14-.482.288-1.295.373-.812.085-2.022.09-3.654.09h-4.363c-1.63 0-2.84-.006-3.653-.09-.813-.083-1.14-.23-1.295-.37-.154-.142-.315-.442-.407-1.188-.092-.745-.098-1.854-.098-3.35v-9.998c0-1.495.007-2.604.098-3.35.092-.745.25-1.045.405-1.187.154-.14.482-.288 1.295-.372.813-.085 2.023-.09 3.655-.09z" fill="black" fill-rule="evenodd"/></svg>',
	},
];

interface ShareDialog {
	title: string,
	href: string,
	onClose: () => void
}
function ShareDialog({
	href,
	onClose,
	title: pageTitle,
}: ShareDialog) {
	const [show, setShowing] = useState(false);
	useEffect(() => {
		setShowing(true);
	}, []);
	return (
		<div className={show ? classes.webShareReady : classes.webShare} onClick={(e) => {
			e.target === e.currentTarget && onClose();
		}}>
			<div className={classes.webShareContainer}>
				<div className={classes.webShareTitle}>SHARE VIA</div>
				{definitions.map(({ title, icon, link, action }) => {
					const children = <>
						{/* eslint-disable-next-line react/forbid-elements */}
						<img src={icon} alt="" />
						<span>{title}</span>
					</>;
					const shareUrl = new URL(href);
					shareUrl.searchParams.set('utm_source', title.toLowerCase());
					return link ? (
						<a key={title} href={link(shareUrl.href, pageTitle)} className={classes.webShareItem} target="_blank" rel="noopener" onClick={onClose}>
							{children}
						</a>
					) : (
						<div key={title} className={classes.webShareItem} onClick={() => {
							action(shareUrl.href, pageTitle);
							onClose();
						}}>
							{children}
						</div>
					);
				})}
			</div>
			<div className={classes.webShareCancel} onClick={onClose}>Cancel</div>
		</div>
	);
}
export default ShareDialog;
