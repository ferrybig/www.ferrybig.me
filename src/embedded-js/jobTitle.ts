import InstantClick from './lib/instantClick';

let roleChangerActive = false;
let roleChangerInterval: null | ReturnType<typeof window.setInterval> = null;
function changeRole(element: HTMLElement, restore: boolean) {
	if (!element) return;
	roleChangerActive = true;
	delete element.dataset.active;

	const roles = [
		['A ', 'full-stack', ' developer!'],
		['A ', 'full-stack', ' creator!'],
		['A ', 'full-stack', ' programmer!'],
		['A ', 'full-stack', ' expert!'],
		['An ', 'all-round', ' developer!'],
		['An ', 'all-round', ' programmer!'],
		['A ', 'white-hat', ' hacker!'],
		['A ', 'programming', ' geek!'],
		['A ', 'programming', ' nerd!'],
		['An ', 'awesome', ' person!'],
		['An ', 'great', ' person!'],
		['The ', 'best', ' developer!'],
		['Simply ', 'the', ' best.'],
		['$ A ', 'Linux', ' programmer!'],
		['A ', 'Linux', ' expert!'],
		['An ', 'IPv6', ' expert!'],
		['An ', 'IPv4', ' expert!'],
		['A ', 'NGINX', ' expert!'],
		['A ', 'Devops', ' person!'],
		['A ', 'Devops', ' expert!'],
		['A ', 'React', ' programmer!'],
		['A ', 'React', ' teacher!'],
		['A ', 'React', ' expert!'],
		['A ', 'Redux', ' programmer!'],
		['A ', 'Redux', ' teacher!'],
		['A ', 'Redux', ' expert!'],
		['A ', 'TypeScript', ' programmer!'],
		['A ', 'TypeScript', ' hacker!'],
		['A ', 'TypeScript', ' expert!'],
		['A ', 'JavaScript', ' programmer!'],
		['A ', 'JavaScript', ' hacker!'],
		['A ', 'JavaScript', ' expert!'],
		['A ', 'Java', ' programmer!'],
		['A ', 'Java', ' hacker!'],
		['A ', 'Java', ' expert!'],
		['An ', 'CSS animation', ' expert!'],
		['An ', 'CSS animation', ' programmer!'],
		['A ', 'HTML5', ' programmer!'],
		['A ', 'HTML5', ' expert!'],
		['A ', 'Webpack', ' hacker!'],
		['A ', 'MDN', ' contributor!'],
		['A ', 'StackOverflow', ' contributor!'],
		['A ', 'StackOverflow', ' hacker!'],
		['A ', 'coding', ' teacher!'],
		['An ', 'OpenSource', ' believer!'],
		['An ', 'OpenSource', ' hacker!'],
		['An ', 'OpenSource', ' creator!'],
		['An ', 'OpenSource', ' builder!'],
		['A ', 'Web', 'Designer!'],
		['A ', 'Web', ' Developer!'],
		['An ', 'experienced', ' Developer!'],
	];
	const newRole = restore ? [] : roles[Math.floor(Math.random() * roles.length)];

	for (let i = 0; i < element.childNodes.length; i++) {
		if (restore) {
			newRole.push((element.childNodes[i] as HTMLElement).innerText);
		}
		(element.childNodes[i] as HTMLElement).innerHTML = i === 0 ? '&nbsp;' : '';
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
			if (roleChangerInterval !== null) {
				clearInterval(roleChangerInterval);
			}
			roleChangerInterval = null;
			element.dataset.active = '';
			if (restore) {
				roleChangerActive = false;
			}
			return;
		}
		(element.childNodes[arrayIndex] as HTMLElement).innerText = newRole[arrayIndex].substring(0, charIndex + 1);
		charIndex++;
	}, 50);
}

function injectRoleChanger() {
	const element = document.getElementById('role-clicker');
	if (!element) return;
	element.childNodes[1].addEventListener('click', () => {
		changeRole(element, false);
	});
	if (roleChangerActive) {
		changeRole(element, true);
	}
}

InstantClick.on('change', injectRoleChanger);
