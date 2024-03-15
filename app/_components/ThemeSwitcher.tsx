'use client';
import { useCallback, useEffect, useState } from 'react';
import dark from '@assets/moon-24.svg';
import light from '@assets/sun-24.svg';
import NavIcon from './NavIcon';


function ThemeSwitcher() {
	const [mode, setMode] = useState<boolean | null>(null);
	useEffect(() => {
		switch (mode) {
		case null:
			return;
		case true:
			document.documentElement.style.setProperty('color-scheme', 'only dark');
			break;
		case false:
			document.documentElement.style.setProperty('color-scheme', 'only light');
			break;
		}
		return () => {
			document.documentElement.style.removeProperty('color-scheme');
		};
	});
	const onDark = useCallback(() => {
		setMode(state => state === true ? null : true);
	},[]);
	const onLight = useCallback(() => {
		setMode(state => state === false ? null : false);
	}, []);


	return (
		<>
			<NavIcon
				src={dark}
				active={mode === true}
				alt={(mode === true ? 'Disable' : 'Enable') + ' dark mode'}
				title={(mode === true ? 'Disable' : 'Enable') + ' dark mode'}
				onClick={onDark}
			/>
			<NavIcon
				src={light}
				active={mode === false}
				alt={(mode === false ? 'Disable' : 'Enable') + ' light mode'}
				title={(mode === false ? 'Disable' : 'Enable') + ' light mode'}
				onClick={onLight}
			/>
		</>
	);
}
export default ThemeSwitcher;
