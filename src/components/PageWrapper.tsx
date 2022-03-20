import { ComponentProps, ReactNode } from "react"
import Nav from "./Nav";
import classes from './PageWrapper.module.css';
import RootWrapper from "./RootWrapper";

interface Props extends ComponentProps<typeof RootWrapper> {
}

export default function PageWrapper({
	children,
	...rest
}: Props) {
	return (
		<RootWrapper {...rest}>
			<Nav/>
			<main>
				{children}
			</main>
		</RootWrapper>
	)
}