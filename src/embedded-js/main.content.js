InstantClick.init();
document.addEventListener('load', () => {
	const theme = localStorage.getItem('theme');
	if (theme === 'white') {
		document.body.classList.add(document.body.dataset.whiteTheme);
	}
	if (theme === 'dark') {
		document.body.classList.add(document.body.dataset.darkTheme);
	}
})