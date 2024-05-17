'use client';
import { SetStateAction, useCallback, useEffect, useState } from 'react';
import dark from '@assets/moon-24.svg';
import light from '@assets/sun-24.svg';
import NavIcon from './NavIcon';

function useStorage<T>(storageType: 'session' | 'local', key: string, defaultValue: T): [T, (value: SetStateAction<T>) => void] {
	const [value, setValue] = useState(() => defaultValue);
	useEffect(() => {
		const storage = storageType === 'session' ? sessionStorage : localStorage;
		function listener() {
			const storedValue = storage.getItem(key);
			if (storedValue !== null) {
				try {
					setValue(JSON.parse(storedValue));
				} catch (e) {
					console.error(e);
				}
			} else {
				setValue(defaultValue);
			}
		}
		listener();
		addEventListener('storage', listener);
		return () => {
			removeEventListener('storage', listener);
		};
	}, [storageType, key, defaultValue]);
	const setItem = useCallback((newValueFactory: SetStateAction<T>) => {
		const storage = storageType === 'session' ? sessionStorage : localStorage;
		const storedValue = storage.getItem(key);
		let oldValue = defaultValue;
		if (storedValue !== null) {
			try {
				oldValue = JSON.parse(storedValue);
			} catch (e) {
				console.error(e);
			}
		}
		const newValue = newValueFactory instanceof Function ? newValueFactory(oldValue) : newValueFactory;
		setValue(() => newValue);
		if (newValue === defaultValue) storage.removeItem(key);
		else storage.setItem(key, JSON.stringify(newValue));
	}, [defaultValue, storageType, key]);
	return [value, setItem];

}

function ThemeSwitcher() {
	const [mode, setMode] = useStorage<boolean | null>('session', 'theme', null);
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
	}, [setMode]);
	const onLight = useCallback(() => {
		setMode(state => state === false ? null : false);
	}, [setMode]);


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
