import { ComponentProps, ReactNode } from "react"
import Nav from "./Nav";
import classes from './PageWrapper.module.css';
import RootWrapper from "./RootWrapper";
import ThemeSwitcher from "./ThemeSwitcher";
import TopBar from "./TopBar";

interface Props extends ComponentProps<typeof RootWrapper> {
}

export default function PageWrapper({
	children,
	...rest
}: Props) {
	return (
		<RootWrapper {...rest}>
			<TopBar/>
			<main>
				{children}
			</main>
		</RootWrapper>
	)
}