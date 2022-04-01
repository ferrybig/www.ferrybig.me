"use strict";
(() => {
	function injectThemeSwitcher() {
		let theme = localStorage.getItem('theme');
		if (theme === 'white') {
			document.body.classList.add(document.documentElement.dataset.themeLight);
		} else if (theme === 'dark') {
			document.body.classList.add(document.documentElement.dataset.themeDark);
		} else {
			theme = 'auto';
		}
		const themeSwitcher = document.querySelector("#theme-switcher");
		if (!themeSwitcher) {
			return;
		}
		const unhideClass = themeSwitcher.dataset.classUnhide;
		const selectedClass = themeSwitcher.dataset.classSelected;
		themeSwitcher.classList.add(unhideClass)
		const buttons = themeSwitcher.querySelectorAll('button[data-theme]');
		const themeMap = {
			white: document.documentElement.dataset.themeLight,
			dark: document.documentElement.dataset.themeDark,
		}
		for (const button of buttons) {
			button.classList[button.dataset.theme === theme ? 'add' : 'remove'](selectedClass);
			button.addEventListener('click', () => {
				const ms = 1000;
				const style = document.createElement('style');
				style.innerText = `* { transition: all ${ms}ms; }`
				const head = document.head;
				head.appendChild(style);
				const theme = button.dataset.theme;
				for (const [key, value] of Object.entries(themeMap)) {
					document.body.classList[key === theme ? 'add' : 'remove'](value);
				}
				for (const otherButton of buttons) {
					otherButton.classList[otherButton.dataset.theme === theme ? 'add' : 'remove'](selectedClass);
				}
				if (theme === 'auto') {
					localStorage.removeItem('theme');
				} else {
					localStorage.setItem('theme', theme);
				}
				setTimeout(() => head.removeChild(style), ms);
			})
		}
	}

	let roleChangerActive = false;
	let roleChangerInterval = null;
	function changeRole(element, restore) {
		if (!element) return;
		roleChangerActive = true;
		delete element.dataset.active;

		const roles = [
			["A ", "full-stack", " developer!"],
			["A ", "full-stack", " creator!"],
			["A ", "full-stack", " programmer!"],
			["A ", "full-stack", " expert!"],
			["A ", "white-hat", " hacker!"],
			["A ", "programming", " geek!"],
			["A ", "programming", " nerd!"],
			["An ", "awesome", " person!"],
			["An ", "great", " person!"],
			["The ", "best", " developer!"],
			["Simply ", "the", " best."],
			["$ A ", "Linux", " programmer!"],
			["A ", "Linux", " expert!"],
			["An ", "IPv6", " expert!"],
			["An ", "IPv4", " expert!"],
			["A ", "NGINX", " expert!"],
			["A ", "Devops", " person!"],
			["A ", "Devops", " expert!"],
			["A ", "React", " programmer!"],
			["A ", "React", " teacher!"],
			["A ", "React", " expert!"],
			["A ", "TypeScript", " programmer!"],
			["A ", "TypeScript", " hacker!"],
			["A ", "TypeScript", " expert!"],
			["A ", "JavaScript", " programmer!"],
			["A ", "JavaScript", " hacker!"],
			["A ", "JavaScript", " expert!"],
			["An ", "CSS animation", " expert!"],
			["An ", "CSS animation", " programmer!"],
			["A ", "HTML5", " programmer!"],
			["A ", "HTML5", " expert!"],
			["A ", "Webpack", " hacker!"],
			["A ", "MDN", " contributor!"],
			["A ", "StackOverflow", " contributor!"],
			["A ", "StackOverflow", " hacker!"],
			["A ", "coding", " teacher!"],
			["An ", "OpenSource", " believer!"],
			["An ", "OpenSource", " hacker!"],
			["An ", "OpenSource", " creator!"],
			["An ", "OpenSource", " builder!"],
		]
		const newRole = restore ? [] : roles[Math.floor(Math.random() * roles.length)];
		
		for (let i = 0; i < element.childNodes.length; i++) {
			if (restore) {
				newRole.push(element.childNodes[i].innerText);
			}
			element.childNodes[i].innerHTML = i === 0 ? '&nbsp;' : '';
		}
		if (roleChangerInterval !== null) {
			clearInterval(roleChangerInterval);
		}
		let arrayIndex = 0;
		let charIndex = 0;
		roleChangerInterval = setInterval(() => {
			if (charIndex >= newRole[arrayIndex].length) {
				charIndex = 0;
				arrayIndex += 1;
			}
			if (arrayIndex >= newRole.length) {
				clearInterval(roleChangerInterval);
				roleChangerInterval = null;
				element.dataset.active = true;
				if (restore) {
					roleChangerActive = false;
				}
				return;
			}
			element.childNodes[arrayIndex].innerText = newRole[arrayIndex].substring(0, charIndex + 1);
			charIndex++;
		}, 50);
	}

	function injectRoleChanger() {
		const element = document.querySelector("#role-clicker");
		if (!element) return;
		element.childNodes[1].addEventListener('click', () => {
			changeRole(element);
		});
		if (roleChangerActive) {
			changeRole(document.body.querySelector("#role-clicker"), true);
		}
	}

	function onPageLoad() {
		injectThemeSwitcher();
		injectRoleChanger();
	}
	InstantClick.on('change', onPageLoad);
	InstantClick.on('receive', function(url, body, title) {
		body.className = document.body.className;
	});
	InstantClick.init();
})();
