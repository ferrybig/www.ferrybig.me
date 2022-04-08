import notUndef from '../utils/notUndef';
import InstantClick from './lib/instantClick';

function injectThemeSwitcher() {
	let theme = localStorage.getItem('theme');
	if (theme === 'white') {
		document.body.classList.add(notUndef(document.documentElement.dataset.themeLight));
	} else if (theme === 'dark') {
		document.body.classList.add(notUndef(document.documentElement.dataset.themeDark));
	} else {
		theme = 'auto';
	}
	const themeSwitcher = document.getElementById('theme-switcher');
	if (!themeSwitcher) {
		return;
	}
	const unhideClass = notUndef(themeSwitcher.dataset.classUnhide);
	const selectedClass = notUndef(themeSwitcher.dataset.classSelected);
	themeSwitcher.classList.add(unhideClass);
	const buttons = Array.from(themeSwitcher.querySelectorAll('button[data-theme]')) as HTMLElement[];
	const themeMap = {
		white: notUndef(document.documentElement.dataset.themeLight),
		dark: notUndef(document.documentElement.dataset.themeDark),
	};
	for (const button of buttons) {
		button.classList[button.dataset.theme === theme ? 'add' : 'remove'](selectedClass);
		button.addEventListener('click', () => {
			const ms = 200;
			const style = document.createElement('style');
			style.innerText = `* { transition: all ${ms}ms; }`;
			const head = document.head;
			head.appendChild(style);
			const newTheme = notUndef(button.dataset.theme);
			for (const [key, value] of Object.entries(themeMap)) {
				document.body.classList[key === newTheme ? 'add' : 'remove'](value);
			}
			for (const otherButton of buttons) {
				otherButton.classList[otherButton.dataset.theme === newTheme ? 'add' : 'remove'](selectedClass);
			}
			if (newTheme === 'auto') {
				localStorage.removeItem('theme');
			} else {
				localStorage.setItem('theme', newTheme);
			}
			setTimeout(() => head.removeChild(style), ms);
		});
	}
}

InstantClick.on('change', injectThemeSwitcher);
InstantClick.on('receive', (url, body) => {
	body.className = document.body.className;
});
